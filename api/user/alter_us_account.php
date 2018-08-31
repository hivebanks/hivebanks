<?php
require_once '../inc/common.php';
require_once  'db/us_base.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户昵称修改 ==========================
GET参数
   token           请求的用户token
   us_account      用户的昵称
返回
   us_account      us的昵称
说明
*/
php_begin();
$args = array('token','us_account');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
// 用户昵称
$us_account = get_arg_str('GET', 'us_account');
//验证token
$us_id = check_token($token);
// 判断昵称更新是否成功
if (!upd_us_accout($us_id,$us_account))
    exit_error("101","Information entry or update failed");
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['us_account'] = $us_account;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
