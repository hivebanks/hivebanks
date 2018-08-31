<?php
require_once "../inc/common.php";
require_once '../inc/judge_format.php';
require_once "db/ba_log_bind.php";
require_once "../plugin/sms/sendSms.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 发送手机验证码 ==========================
GET参数
    cellphone                 手机号码
    country_code              国家代码
返回
  errcode = 0     发送成功
*/

php_begin();

$args = array('cellphone','country_code','bind_type');
chk_empty_args('GET', $args);
$cfm_code = get_arg_str('GET', 'cfm_code');
//参数整理
$cellphone = get_arg_str('GET', 'cellphone',20);
$bind_type = get_arg_str('GET', 'bind_type',20);
$country_code = get_arg_str('GET', 'country_code',5);
$code  =  rand(100000,999999);
$phone_strict = $country_code . '-' . $cellphone;
$is_phone = isPhone($cellphone);
if(!$is_phone)
    exit_error('100 ','phone format error');
if ($cfm_code != $_SESSION["authcode"])
    exit_error("139","图形验证码有误");
//判断验证码发送数量是否超过最大限制
$phone_code_num_limit = ba_phone_code_limit_check($phone_strict);

if($phone_code_num_limit>40)
    exit_error('108','no times for send code');

//获取最新一条发送记录
$phone_code_last_time = get_ba_log_bind_by_variable('phone_code',$phone_strict);

//判断是否在限制时间范围内
if($phone_code_last_time['limt_time'] > time())
    exit_error('116',$phone_code_last_time['limt_time'] - time());

$time_limit = time() + 60 ;
$data = array();
$data['ba_id']  = get_guid();
$data['bind_name']  = 'phone_code';
$data['bind_info']  = $phone_strict;
$data['count_error'] = 0;
$data['limt_time']  = $time_limit;
$data['bind_type']  = $bind_type;
$data['bind_salt']  = $code;
$res = ins_ba_verification_code($data);

// 验证发送短信(SendSms)接口
$sms = new \Aliyun\DySDKLite\Sms\SMS();
$res_obj = $sms->send_sms($cellphone,$code);
$res_arr = (array) $res_obj;
$res_code = $res_arr['Code'];

switch ($res_code){
    case 'OK':
        exit_ok();
        break;
    default ;
        exit_error('124','发送失败:'.$res_arr['Message']);
        break;
}
