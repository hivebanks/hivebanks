<?php

require_once "../../../inc/common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取错误编码 ==========================
GET参数
    token             用户token
返回
  errcode = 0      请求成功
  row              错误编码
说明
*/

php_begin();
$args = array("token");
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);

$key = Config::TOKEN_KEY;
// 获取token并解密
$des = new Des();
$decryption_code = $des -> decrypt($token, $key);
$now_time = time();
$code_conf =  explode(',',$decryption_code);
// 获取token中的需求信息
$user = $code_conf[0];
$timestamp = $code_conf[1];
if($timestamp < $now_time){
    exit_error('114','Token timeout please retrieve!');
}
$dir_path = dirname(dirname(dirname(dirname(dirname(__FILE__)))))."/h5/";
$json = file_get_contents($dir_path.'assets/json/errcode.json');
$arr = json_decode($json,true);

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['row'] = $arr;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
