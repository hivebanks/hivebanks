<?php

require_once "../../../inc/common.php";
require_once "../db/com_option_config.php";
require_once  "../db/la_admin.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 删除ba的bit_type ==========================
GET参数
token             用户token
option_key         选项关键字
返回
  errcode = 0      请求成功
说明
*/

php_begin();
$args = array("token","option_key");
chk_empty_args('GET', $args);

$option_key = get_arg_str('GET', 'option_key');
// 用户token
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
//判断la是否存在
$row = get_la_by_user($user);
if(!$row){
    exit_error('112','用户不存在');
}
$data = array();
$data["option_name"] = "bit_type";
$data["option_key"] = $option_key;
$data["sub_id"] = "BA";
$row = sel_ba_com_option_config_by_option_key($option_key);
if ($row["status"] == 9)
    exit_error("112","不存在或已经删除");
if(!upd_ba_com_option_config($option_key))
    exit_error("101","更新错误");
exit_ok();
