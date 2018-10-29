<?php

require_once "../../../inc/common.php";
require_once  "../db/la_admin.php";
require_once "../db/com_option_config.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 注册开关 ==========================
GET参数
    token             用户token
    type              注册类型
返回
    errcode = 0      请求成功
    option_name      选项名称
    option_value     选项值
说明
   是否开启注册
*/

php_begin();
$args = array('token','type');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
$type =  get_arg_str('GET', 'type',10);
$status =  get_arg_str('GET', 'status',10);
if($status!=0&&$status!=1)
    exit_error('100 ','status error');
la_user_check($token);
$res = www_reg_permission_modify($type,$status);
if($res)
    exit_ok();
exit_error('101','修改注册权限失败');
