<?php
require_once "../../../inc/common.php";
require_once "db/la_admin.php";
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 设置email信息 ==========================
GET参数
    token             用户token
    Host               邮箱类型
    Username           邮箱姓名
    Password           邮箱密码（授权码，非真实密码）
    address            邮箱地址
    name               发送头名称
返回
  errcode = 0      请求成功
  row             返回配置信息

说明
*/

php_begin();
$args = array("token",'key_code');
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token','128');
$key_code = get_arg_str('GET', 'key_code');

$key = Config::TOKEN_KEY;

$la_id = check_token($token);
print_r($la_id);

if(!upd_la_admin_key_code($la_id,$key_code))
    exit_error("156","开通失败");
exit_ok();
