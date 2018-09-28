<?php

require_once "../../../inc/common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取短信配置 ==========================
GET参数
    token             用户token
返回
  errcode = 0      请求成功
  row              短信配置
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



$json = file_get_contents('../../../plugin/sms/sms_config.json');
$arr = json_decode($json,true);

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['row'] = $arr;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


//$arr["accessKeyId"]="111";
//$json_strings = json_encode($arr);
//file_put_contents('config.json',$json_strings);


