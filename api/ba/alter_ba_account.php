<?php

require_once '../inc/common.php';
require_once  'db/ba_base.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== ba昵称修改 ==========================
GET参数
   token           请求的用户token
   ba_account      ba的昵称
返回
  ba_account      ba的昵称
说明
*/

php_begin();
$args = array('token','ba_account');
chk_empty_args('GET', $args);
// 用户token
$token = get_arg_str('GET', 'token', 128);
$ba_account = get_arg_str('GET', 'ba_account');

//验证token
$ba_id = check_token($token);
if (!upd_ba_accout($ba_id,$ba_account))
    exit_error("101","更新失败");
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['ba_account'] = $ba_account;

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
