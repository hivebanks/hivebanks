<?php
require_once '../inc/common.php';
require_once 'db/ca_base.php';
require_once 'db/ca_bind.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 重置密码（手机） ==========================
GET参数
  country_code           国家代码
  pass_word_hash         新密码HASH
  sms_code               验证码
  cellphone              手机号码
返回
  errcode = 0     请求成功
说明
*/

php_begin();
$args = array('country_code', 'cellphone','pass_word_hash','sms_code');
chk_empty_args('GET', $args);

// 国家代码
$country_code = get_arg_str('GET', 'country_code');
// 电话号码
$cellphone = get_arg_str('GET', 'cellphone');
// 密码HASH
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');
// 验证码
 $sms_code = get_arg_str('GET', 'sms_code');
$cellphone_num = $country_code .'-'. $cellphone;
$variable = 'cellphone';
$variable_code ='phone_code';
// 获取最新的创建记录
$row = get_ca_id_by_variable($variable,$cellphone_num);
if(!$row['us_id']){
    exit_error('112', 'User does not exist');
}

// 获取绑定信息日志表该用户最新的数据
$rec = get_ca_log_bind_by_variable($variable_code , $cellphone_num);

if($rec['bind_info'] != $row['bind_info']){
    exit_error('109','绑定手机与当前手机不同');
}
//超时判断
if((strtotime($rec['ctime']) + 5*60) < time()){
    exit_error('111','信息过期，请重试！');
}

if(empty($rec) || $rec['bind_salt'] != $sms_code || $rec['bind_info']!= $cellphone_num)
    exit_error('110','验证码不正确，请重试');
if(($rec['limt_time'] + 29*60) < $now_time)
    exit_error("111","验证超时");

//已使用的验证码消除使用权限
$userd_salt =  upd_ca_log_bind_variable($variable_code , $cellphone_num);
if(!$userd_salt){
    exit_error('101','验证码被修改');
}

$upd_pass_for_phone = upd_pass_for_ca_id($row['ca_id'],$pass_word_hash);
if($upd_pass_for_phone){
    exit_ok('Modified successfully!');
}else{
    exit_error('101',  'Modify failed please try again!');
}
