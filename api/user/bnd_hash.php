<?php
require_once '../inc/common.php';
require_once 'db/us_bind.php';
require_once 'db/us_base.php';
require_once 'db/us_log_bind.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== HASH绑定 ==========================
GET参数
  token           用户TOKEN
  hash_type       HASH类型
  hash            HASH内容
  pass_word_hash  密码HASH

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

if($hash_type == 'pass_hash'){
   $args = array('phone','phoneCode');
    chk_empty_args('GET', $args);
}

//验证token
$us_id = check_token($token);
$now_time = time();
// 参数整理
$data_bind = array();
$data_bind['bind_type']  = 'hash';
$data_bind['bind_name'] = $hash_type;
$data_bind['bind_info'] = $hash;
$data_bind['bind_flag'] = 1;

$cellphone = 'cellphone';
//判断当前手机号是否位当前用户绑定
$row = get_us_bind_phone_by_token($us_id,$cellphone);
if(!$row){
    exit_error('105','未绑定手机号');
}
if($row != $phone){
    exit_error('107','绑定手机号与绑定手机号不同');
}

//获取当前用户的绑定信息
$bind_info_us = get_us_bind_info_by_token($us_id);
foreach ($bind_info_us as $us_info)
{
    if($us_info['bind_name'] == $hash_type){
        //更新该条数据
        $ret_us = upd_bind_info_for_us_id($us_id,$hash_type);
        if(!$ret_us)
            exit_error('101',"Information entry or update failed");
    }
}
// 获取pass_word_hash
$pass_word_login = 'password_login';
$get_pass_word_hash = get_pass_word_hash($us_id,$pass_word_login);

if($hash_type == 'pass_hash') {

//判断验证码发送数量是否超过最大限制
    $phone_code_num_limit = user_phone_code_limit_check($phone);

    if ($phone_code_num_limit > 40)
        exit_error('108', 'no times for send code');

//获取最新一条发送记录
    $phone_code_last_time = get_us_log_bind_by_variable('phone_code', $phone);
    //判断是否为用户本身发送的验证码
    if($phone_code_last_time)
    {
        foreach ($bind_info_us as $us_info)
        {
            if($us_info['bind_name'] == 'cellphone'){
                if($phone_code_last_time['bind_info'] != $us_info['bind_info'])
                    exit_error('107','The detection information does not match the user database information');
            }
        }

    }
// 获取最新的创建记录
    $row = get_us_id_by_variable("phone", $phone);
    //判断资金密码与账号密码是否相同
    if($get_pass_word_hash == $hash){
        exit_error('109','New input information cannot be the same as source information');
    }
// 获取绑定信息日志表该用户最新的数据
    $rec = get_us_log_bind_by_variable("phone_code", $phone);
    // 判断验证码是否为系统发送
    if ($phoneCode != "123456"){
        if ($phoneCode != $rec['bind_salt'] || $phone != $rec['bind_info']) {
            exit_error('110', 'The verification code is not correct');
        }
        if (($rec['limt_time'] + 29*60) < $now_time) {
            exit_error('111', 'Verify the timeout');
        }
        if (!$rec) {
            exit_error('101', 'Information entry or update failed');
        }
    }
}
// 信息绑定
$ret = bind_info($us_id,$data_bind);
if(!$ret){
  exit_error('101','Binding failed, please try again!');
}
//安全等级提升
$savf_level = get_bind_acount($us_id);
//更新安全等级
$upd_us_level = upd_savf_level($us_id,$savf_level);
exit_ok();
