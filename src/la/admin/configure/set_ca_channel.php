<?php

require_once "../../../inc/common.php";
require_once "../db/com_option_config.php";
require_once  "../db/la_admin.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 设置ca的渠道==========================
GET参数
token             用户token
 option_value       选项值
option_key         选项关键字
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
$args = array("token","option_key","option_value");
chk_empty_args('GET', $args);

$option_key = get_arg_str('GET', 'option_key');
$option_value = get_arg_str('GET', 'option_value');
// 用户token
$token = get_arg_str('GET', 'token', 128);
$option_key = get_arg_str('GET', 'option_key');
$option_value = get_arg_str('GET', 'option_value');
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
$data["option_name"] = "ca_channel";
$data["option_key"] = $option_key;
$data["option_value"] = $option_value;
$data["sub_id"] = "CA";
$data["status"] = "1";
$row = sel_ca_com_option_config_by_option_key($option_key);
if ($row["status"] == 1){
    exit_error("103","重复添加");
}elseif ($row["status"] == 9){
    if(upd_ca_com_option_config_valid($option_key))
        exit_ok();
    else
        exit_error("101","更新失败");
}
if(!ins_ca_com_option_config($data))
    exit_error("101","插入错误");
$rows = sel_ca_com_option_config();
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
