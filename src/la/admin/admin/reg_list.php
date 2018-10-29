<?php

require_once "../../../inc/common.php";
require_once  "../db/la_admin.php";
require_once "../db/com_option_config.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 注册列表 ==========================
GET参数
    token             用户token
返回
    errcode = 0      请求成功
    option_name      选项名称
    option_value     选项值
说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

$token = get_arg_str('GET', 'token', 255);
la_user_check($token);
$res = admin_reg_permission_list();

if(!$res)
    exit_error('101','no data');
// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $res;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
