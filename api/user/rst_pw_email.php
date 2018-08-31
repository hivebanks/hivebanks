<?php
require_once '../inc/common.php';
require_once 'db/us_base.php';
require_once 'db/us_bind.php';
require_once  'db/us_log_bind.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 重置密码（邮件） ==========================
GET参数
  email           Email地址
  pass_word_hash  新密码HASH
  cfm_code        验证码

返回
  errcode = 0     请求成功

说明
*/
php_begin();
$args = array('email', 'pass_word_hash','cfm_code');
chk_empty_args('GET', $args);

// Email地址
$email = get_arg_str('GET', 'email', 255);
// 密码HASH
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');
// 验证码
$cfm_code = get_arg_str('GET', 'cfm_code');
$variable = 'email';
$now_time = time();
// 获取最新的创建记录
$row = get_us_id_by_variable($variable,$email);

// 获取绑定信息日志表该用户最新的数据
$rec = get_us_log_bind_by_variable($variable , $email);
if($row['bind_info'] !=$rec['bind_info']){
    exit_error('107','绑定邮箱与当前邮箱不同');
}
// 判断验证码是否为系统发送
if($cfm_code != $rec['bind_salt'] || $email != $rec['bind_info']){
    exit_error('110','Inconsistent account or password!');
}
if(($rec['limt_time'] + 29*60) < $now_time){
    exit_error('111','验证超时');
}
// 判断邮箱是否存在
if(!$row['us_id']){
    exit_error('112', 'User does not exist');
}
// 更新密码
$upd_pass_for_email = upd_pass_for_us_id($row['us_id'],$pass_word_hash);
if($upd_pass_for_email){
    exit_ok('Modified successfully!');
}else{
    exit_error('109',  'The change password cannot be the same as the recent password');
}
