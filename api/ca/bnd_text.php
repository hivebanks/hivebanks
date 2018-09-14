<?php

require_once '../inc/common.php';
require_once "../inc/common_agent_email_service.php";
require_once 'db/ca_bind.php';
require_once 'db/ca_base.php';
require_once 'db/ca_log_bind.php';
require_once '../inc/judge_format.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 文本绑定 ==========================
GET参数
  token           用户TOKEN
  text_type       文本类型
  text            文本内容
  text_hash       文本内容HASH
返回
  errcode = 0     请求成功
说明
  绑定手机，邮箱，姓名，身份证，第三方账号等
*/

php_begin();
$args = array('token', 'text_type', 'text');
chk_empty_args('GET', $args);

// 用户TOKEN
$token = get_arg_str('GET', 'token',128);
// 文本类型
$text_type = get_arg_str('GET', 'text_type');
// 文本内容
$text = get_arg_str('GET', 'text', 255);
// 文本内容HASH
$text_hash = get_arg_str('GET', 'text_hash');

//绑定类型
$bind_type = get_arg_str('GET', 'bind_type');

$type_log = array('first','email', 'idNum' ,'name' ,'cellphone','ipAddre');
if($text_type){
    $text_type = $type_log[$text_type];
}
//验证token
$ca_id = check_token($token);
// 参数整理
$data_bind = array();
$data_bind['bind_type']  = 'text';
$data_bind['bind_name'] = $text_type;
$data_bind['bind_info'] = $text;

// 获取当前时间戳
$timestamp = time();
$variable = $text_type;
// 加盐加密
$salt = rand(100000, 999999);

// 判断用户是否已存在
$row = get_ca_id_by_variable($variable,$text);

//绑定邮箱1
if($text_type == 'email'){
    $data_bind['bind_flag'] = 1;
    $is_email = isEmail($text);
    if(!$is_email){
        exit_error('100','The input format is incorrect');
    }
    // 邮件地址已经存在
    if($row['ca_id']){
        //是否注册验证完成
        switch ($row['bind_flag'])
        {
            case 1:
                exit_error('105','Registered users please login directly!');
                break;
            case 9:
                break;
        }
    }
    $url = Config::CA_CONFORM_URL;
    // 发送绑定验证信息
    $timestamp +=15*60;
    $title = '邮箱验证链接';
    $des = new Des();
    $body = $url . "?cfm_hash=";
    $encryption_code = $ca_id.','.$text.',' . $timestamp .','. 'email' .','.$salt;
    $body .=urlencode($des -> encrypt($encryption_code, $key));
    require_once "db/la_admin.php";
    $key_code = get_la_admin_info()["key_code"];

    $output_array = send_email_by_agent_service($email,$title,$body,$key_code);

    if($output_array["errcode"] == "0"){
        exit_ok('Please verify email as soon as possible!');
    }else{
        exit_error('124', 'Create failed! Please try again!');
    }

}
//绑定身份证号2
if($text_type == 'idNum'){
    //判断idNUm是否正确
    $rec  = is_idcard($text);
    if(!$rec)
        exit_error('100','身份证号格式不正确');
}
//绑定姓名3
if($text_type == 'name'){
    $rec = isChineseName($text);
    if(!$rec)
        exit_error('100', '姓名格式不正确');
}
//绑定手机号码4
if($text_type == 'cellphone'){
    $data_bind['bind_flag'] = 1;
    $phone = explode('-',$text)[1];
    $ret = isPhone($phone);
    $variable = 'phone_code';
    $rot = get_ca_log_bind_by_variable($variable , $text);

    if(!$ret){
        exit_error('100','手机号码格式不正确');
    }
    if($row['ca_id']){
        //是否注册验证完成
        switch ($row['bind_flag'])
        {
            case 1:
                exit_error('105','Registered users please login directly!');
                break;
            case 9:
                break;
        }
    }

    if(empty($rot))
        exit_error('113','没有认证信息');
    if(($rot['limt_time'] + 29*60) < $timestamp){
        upd_ca_log_bind_variable($variable_code , $cellphone_num);
        exit_error("111","验证超时");
    }

    if($rot['bind_salt'] != $text_hash || $rot['bind_info']!= $text )
        exit_error('110','验证不正确，请重试');

    //us_log_bind的手机验证码置零
    $upd_us_log = upd_ca_log_bind_variable($variable , $text);
    if(!$upd_us_log){
        exit_error('101','信息验证失败，请重试！');
    }
}

//ip地址绑定
if($text_type == 'ipAddre'){
    $data_bind['bind_flag'] = 1;
    //判断是否为ip
    $ret = isip($text);
    $text = ip2long($text);
    if(!$ret){
        exit_error('100','输入信息格式不正确');
    }
}
// 绑内容是否存在
$ret_bind = check_bind_info($data_bind);
if($ret_bind){
    exit_error('105','The binding already exists please try again！');
}
// 信息绑定
if(isset($data_bind['bind_flag'])){
    $ret =bind_info_ca_bind($ca_id,$data_bind);
}else{
    $ret = bind_log_info($ca_id,$data_bind);
}

if(!$ret){
    exit_error('101','Binding failed, please try again!');
}
//安全等级提升
$savf_level = get_bind_acount($ca_id);
//更新安全等级
$upd_us_level = upd_savf_level($ca_id,$savf_level);
exit_ok();
