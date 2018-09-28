<?php

require_once '../inc/common.php';
require_once  'db/ca_base.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*========================== ca昵称修改 ==========================
GET参数
   token           请求的用户token
   ca_account      ca的昵称
返回
  ca_account      ca的昵称
说明
*/

php_begin();
$args = array('token','ca_account');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
$ca_account = get_arg_str('GET', 'ca_account');

//验证token
$ca_id = check_token($token);
if (!upd_ca_accout($ca_id,$ca_account))
    exit_error("101","更新失败");
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['ca_account'] = $ca_account;

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
