<?php

require_once '../inc/common.php';
require_once 'db/us_bind.php';
require_once 'db/us_base.php';
require_once 'db/us_log_bind.php';
require_once '../inc/judge_format.php';
require_once '../plugin/bind/GoogleAuthenticator/GoogleAuthenticator.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 谷歌绑定 ==========================
GET参数
  token           用户TOKEN
  email           该用户绑定的email
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
$us_id = check_token($token);

//获取用户绑定邮箱
$vail= 'email';
$email = get_us_bind_email_by_us_id($us_id,$vail);
if(!$email){
    exit_error('106','Pre-validation bindings are required');
}
if($email != $email_use){
    exit_error('107','The detection information does not match the user database information');
}
//谷歌绑定
    $ga = new PHPGangsta_GoogleAuthenticator();
    $secret = $ga->createSecret();
$qrCodeUrl = $ga->getQRCodeGoogleUrl('hb.fnying.com', $secret); //第一个参数是"标识",第二个参数为"安全密匙SecretKey" 生成二维码信息
//添加谷歌绑定信息，绑定在email中
$bind_data = '';
$bind_data['us_id'] = $us_id;
$bind_data['bind_type'] = 'Goog';
$bind_data['bind_name'] = 'GoogleAuthenticator';
$bind_data['bind_info'] = $secret;
$bind_data['count_error'] = '0';

$ret = ins_bind_user_reg_bind_log($bind_data);
if(!$ret){
    exit_error('101',"Information entry or update failed");
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['secret'] =$secret;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
