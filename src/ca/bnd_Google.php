<?php

require_once '../inc/common.php';
require_once 'db/ca_bind.php';
require_once 'db/ca_log_bind.php';
require_once '../inc/judge_format.php';
require_once '../plugin/bind/GoogleAuthenticator/GoogleAuthenticator.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 谷歌绑定 ==========================
GET参数
  token           用户TOKEN
  email           用户email
返回
  errcode = 0     请求成功

说明
  绑定谷歌认证器
*/

php_begin();
$args = array('token','email');
chk_empty_args('GET', $args);

// 用户TOKEN
$token = get_arg_str('GET', 'token',128);
// 用于绑定的email
$email_use = get_arg_str('GET', 'email',128);
//验证token
$ca_id = check_token($token);
//获取用户绑定邮箱
$vail= 'email';
$email = get_ca_bind_email_by_ca_id($ca_id,$vail);
if(!$email){
    exit_error('106','请先进行邮箱绑定');
}
if($email != $email_use){
    exit_error('107','绑定邮箱与谷歌绑定邮箱不同，请重试！');
}
//谷歌绑定
    $ga = new PHPGangsta_GoogleAuthenticator();
    $secret = $ga->createSecret();

  //添加谷歌绑定信息，绑定在email中
$bind_data = '';
$bind_data['bind_type'] = 'Goog';
$bind_data['bind_name'] = 'GoogleAuthenticator';
$bind_data['bind_info'] = $secret;
$bind_data['count_error'] = '0';
$bind_data['ca_id'] = $ca_id;

$ret = ins_bind_ca_reg_bind_log($bind_data);
if(!$ret){
    exit_error('101','系统异常请重试');
}
// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['secret'] =$secret;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
