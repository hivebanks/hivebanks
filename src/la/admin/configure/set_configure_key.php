<?php

require_once "../../../inc/common.php";
require_once "../db/com_option_config.php";
require_once  "../db/la_admin.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 设置ba的bit_type ==========================
GET参数
token             用户token
 option_key         选项关键字
 option_value       选项值
返回
  errcode = 0      请求成功
  rows             ba的type数组
    option_name        选项名称
    opyion_sort        选项排序
    sub_id             模块id
    status             有效标志
    option_src         选项图片
    option_key         选项关键字
    option_value       选项值
说明
*/

php_begin();
$args = array("token","api_key");
chk_empty_args('GET', $args);
// 用户token
$token = get_arg_str('GET', 'token', 128);
$api_key = get_arg_str('GET', 'api_key');
$length = strlen($api_key);
if(!preg_match("/^(([a-z]+[0-9]+)|([0-9]+[a-z]+))[a-z0-9]*$/i",$api_key)||$length<1||$length>8)
    exit_error('100','请输入1到8位，数字加字母组合的api_key');
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

$data = array();
$data["option_name"] = "api_key";
$data["option_key"] = "key";
$data["option_value"] = $api_key;
$data["status"] = 1;
$data["sub_id"] = "COM";
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['option_value'] = $api_key;
if (get_configure_key()){
    if(upd_configure_key($data)) {
        $rtn_str = json_encode($rtn_ary);
        php_end($rtn_str);
    }else{
        exit_error("101","更新失败");
    }
}
if(!set_configure_key($data))
    exit_error("101","插入错误");

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
