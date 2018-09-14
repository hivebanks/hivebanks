<?php

require_once '../inc/common.php';
require_once 'db/ca_bind.php';
require_once 'db/ca_base.php';
require_once 'db/ca_log_bind.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== HASH绑定 ==========================
GET参数
  token           用户TOKEN
  hash_type       HASH类型
  hash            HASH内容
返回
  errcode = 0     请求成功
说明
  HASH值绑定
*/

php_begin();
$args = array('token', 'hash_type', 'hash');
chk_empty_args('GET', $args);

// 用户TOKEN
$token = get_arg_str('GET', 'token',128);
// HASH类型
$hash_type = get_arg_str('GET', 'hash_type');
// HASH内容
$hash = get_arg_str('GET', 'hash', 255);
// 密码HASH
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');

//手机号码
$phone = get_arg_str('GET', 'phone');
//手机验证码
$phoneCode = get_arg_str('GET', 'phoneCode');
//验证token
$ca_id = check_token($token);
$now_time = time();
$pass_word_login = 'password_login';
// 获取pass_word_hash
$get_pass_word_hash = get_pass_word_hash($ca_id,$pass_word_login);

if($hash_type == 'pass_hash') {

//判断验证码发送数量是否超过最大限制
    $phone_code_num_limit = ca_phone_code_limit_check($phone);
    if ($phone_code_num_limit > 40)
        exit_error('108', 'no times for send code');
//获取最新一条发送记录
    $phone_code_last_time = get_ca_log_bind_by_variable('phone_code', $phone);
// 获取最新的创建记录
    $row = get_ca_id_by_variable("phone", $phone);
    //判断资金密码与账号密码是否相同
    if($get_pass_word_hash == $hash){
        exit_error('109','资金密码与账户密码不能相同');
    }
// 获取绑定信息日志表该用户最新的数据
    $rec = get_ca_log_bind_by_variable("phone_code", $phone);
    // 判断验证码是否为系统发送
    if ($phoneCode != $rec['bind_salt'] || $phone != $rec['bind_info']) {
        exit_error('110', '验证码不正确');
    }
    if (($rec['limt_time'] + 29*60) < $now_time) {
        exit_error('111', '验证超时');
    }
    if (!$rec) {
        exit_error('113', '验证失败');
    }
}

// 参数整理
$data_bind = array();
$data_bind['bind_type']  = 'hash';
$data_bind['bind_name'] = $hash_type;
$data_bind['bind_info'] = $hash;
$data_bind['bind_flag'] = 1;

// 绑内容是否存在
$ret_bind = check_bind_info($data_bind);
if($ret_bind){
    exit_error('105','The binding already exists please try again！');
}

// 信息绑定
$ret =  bind_info_ca_bind($ca_id,$data_bind);
if(!$ret){
    exit_error('101','Binding failed, please try again!');
}
//安全等级提升
$savf_level = get_bind_acount($ca_id);

//更新安全等级
$upd_us_level = upd_savf_level($ca_id,$savf_level);
exit_ok();
