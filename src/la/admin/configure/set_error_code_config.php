<?php

//require_once "../../../inc/common.php";

//header("cache-control:no-cache,must-revalidate");
//header("Content-Type:application/json;charset=utf-8");

/*
========================== 设置错误编码信息 ==========================
GET参数
    token             用户token
    code_key           错误编号
    code_value         错误值
返回
  errcode = 0      请求成功
  row             返回配置信息

说明
*/

//php_begin();
//$args = array("token",'code_key','code_value');
//chk_empty_args('GET', $args);
//$token = get_arg_str('GET', 'token',128);
//$code_key = get_arg_str('GET', 'code_key');
//$code_value = get_arg_str('GET', 'code_value',255);
//$key = Config::TOKEN_KEY;
//// 获取token并解密
//$des = new Des();
//$decryption_code = $des -> decrypt($token, $key);
//$now_time = time();
//$code_conf =  explode(',',$decryption_code);
//// 获取token中的需求信息
//$user = $code_conf[0];
//$timestamp = $code_conf[1];
//if($timestamp < $now_time){
//    exit_error('114','Token timeout please retrieve!');
//}

$dir_path = dirname(dirname(dirname(dirname(dirname(__FILE__)))))."/h5";
$json = file_get_contents($dir_path.'/assets/json/errcode.json');
$arr = json_decode($json,true);
$found_key = array_search($code_key, array_column($arr, 'code_key'));
if ($found_key === false)
    exit_error("112","当前错误码不存在");

$arr[$found_key]["code_value"] = $code_value;

$data = array();
$data["code_key"] = $code_key;
$data["code_value"] = $code_value;


file_put_contents($dir_path.'/assets/json/errcode.json',json_encode($arr));
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['row'] = $data;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

