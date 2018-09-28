<?php

require_once '../inc/common.php';
require_once 'db/ba_bind.php';
require_once 'db/ba_log_bind.php';
require_once '../inc/judge_format.php';
require_once '../plugin/bind/GoogleAuthenticator/GoogleAuthenticator.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 请求谷歌验证 ==========================
GET参数
  token            用户token
  code         验证码
返回
  errcode  = 0    成功
*/

php_begin();

$args = array('cfm_code','token');
chk_empty_args('GET', $args);

//验证码
$cfm_code = get_arg_str('GET','cfm_code');


// token
$token = get_arg_str('GET','token');

//验证token
$ba_id = check_token($token);

$vail = 'GoogleAuthenticator';
//安全密钥获取
$secret = get_secret_by_ba_id($ba_id,$vail);

    $ga = new PHPGangsta_GoogleAuthenticator();

if(!$secret){
   exit_error('112','未进行谷歌绑定');
}
    $oneCode = $ga->getCode($secret); //服务端计算"一次性验证码"

    $checkResult = $ga->verifyCode($secret, $cfm_code, 1);//1为容差时间，代表1*30秒
    if (!$checkResult) {
        exit_error('110','验证不正确,请重试！');
    }
$bind_data = '';
$bind_data['bind_type'] = 'Goog';
$bind_data['bind_name'] = $vail;
$bind_data['bind_info'] = $secret;
$bind_data['bind_flag'] = '1';
$google_bnd = bind_info($ba_id, $bind_data);
if(!$google_bnd){
    exit_error('101','确认失败');
}
exit_ok();
