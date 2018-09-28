<?php

require_once "../../../inc/common.php";
require_once "db/kyc_ca.php";
require_once  "db/la_admin.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*========================== ca地址审核确认 ==========================
GET参数
     token        用户token
     ca_id        caid
     bind_id      绑定id
返回
    errcode = 0          请求成功

说明
*/

php_begin();
$args = array("token","bind_id","ca_id");
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);
$bind_id = get_arg_str('GET', 'bind_id', 128);
$ca_id = get_arg_str('GET', 'ca_id', 128);

//检查la用户
la_user_check($token);

//获取ca注册列表
$res = ca_address_confirm($bind_id,$ca_id);
if(!$res)
    exit_error('136','审核失败');

//返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
