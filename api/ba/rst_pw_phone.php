<?php

require_once '../inc/common.php';
require_once 'db/ba_base.php';
require_once 'db/ba_bind.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 重置密码（手机） ==========================
GET参数
  country_code           国家代码
  pass_word_hash         新密码HASH
  cfm_code               验证码
  cellphone              手机号码
返回
  errcode = 0     请求成功
说明
*/

php_begin();
$args = array('country_code', 'cellphone','pass_word_hash');
chk_empty_args('GET', $args);

// 国家代码
$country_code = get_arg_str('GET', 'country_code');
// 电话号码
$cellphone = get_arg_str('GET', 'cellphone');
// 密码HASH
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');
// 验证码
// $cfm_code = get_arg_str('GET', 'cfm_code');
$cellphone_num = $country_code .'-'. $cellphone;
$variable = 'cellphone';
// 获取最新的创建记录
$row = get_ba_id_by_variable($variable,$cellphone_num);
if(!$row['ba_id']){
    exit_error('112', 'User does not exist');
}
$upd_pass_for_phone = upd_pass_for_ba_id($row['ba_id'],$pass_word_hash,$variable);
if($upd_pass_for_phone){
    exit_ok('Modified successfully!');
}else{
    exit_error('101',  'Modify failed please try again!');
}
