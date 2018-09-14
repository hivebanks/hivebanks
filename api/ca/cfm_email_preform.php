<?php

require_once '../inc/common.php';
require_once '../inc/judge_format.php';
require_once 'db/ca_base.php';
require_once 'db/ca_bind.php';
require_once "../inc/common_agent_email_service.php";
require_once  'db/ca_log_bind.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 发送邮箱验证码 ==========================
GET参数
  email           Email地址
返回
  errcode = 0     请求成功
说明
  返回验证码      随机的六位数验证码
*/

php_begin();
$args = array('email');
chk_empty_args('GET', $args);

// email地址
$email = get_arg_str('GET', 'email', 255);
// 判断是否为邮箱地址
$is_email = isEmail($email);
if(!$is_email){
    exit_error('100','The input format is incorrect');
}
//获取当前时间戳
$timestamp = time();
$variable = 'email';
//加盐加密
$salt = rand(100000, 999999);

// 判断邮箱是否已存在
$row = get_ca_id_by_variable($variable,$email);

// 邮件地址已经存在
if($row['ca_id']){
    //是否注册验证完成
    switch ($row['bind_flag'])
    {
        case 1:
            // exit_error('105','Registered users please login directly!');
            break;
        case 9:
            exit_error('105','Registered users please login directly!');
            break;
    }
}

$url = Config::CONFORM_URL;
//发送绑定验证信息
//判断验证码发送数量是否超过最大限制
$email_code_num_limit = ca_phone_code_limit_check($email);

if($email_code_num_limit>4)
    exit_error('108','no times for send code');

//获取最新一条发送记录
$email_code_last_time = get_ca_log_bind_by_variable('email',$email);

//判断是否在限制时间范围内
if($email_code_last_time['limt_time'] > time())
    exit_error('116',$email_code_last_time['limt_time'] - time());
// $timestamp +=15*60;
$title = '邮箱验证';
// $des = new Des();
$body = "您的验证码是:".$salt ."，如果非本人操作无需理会！";
require_once "db/la_admin.php";
$key_code = get_la_admin_info()["key_code"];

$output_array = send_email_by_agent_service($email,$title,$body,$key_code);

if($output_array["errcode"] == "0"){
    $time_limit = time() + 60 ;
    $data = array();
    $data['ca_id']  = get_guid();
    $data['bind_name']  = 'email';
    $data['bind_info']  = $email;
    $data['count_error'] = 0;
    $data['limt_time']  = $time_limit;
    $data['bind_type']  = 'text';
    $data['bind_salt']  = $salt;
    $res = ins_ca_verification_code($data);
    if($res) {
        exit_ok('Please verify email as soon as possible!');
    }
    exit_error('124', 'Create failed! Please try again!');

}else{
    exit_error('124', '邮件发送失败请稍后重试！');
}

