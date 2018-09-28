<?php

require_once "../../../inc/common.php";
require_once "db/kyc_ca.php";
require_once  "db/la_admin.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*========================== ca注册审核列表 ==========================
GET参数
    token        用户token
返回
    errcode = 0          请求成功
     rows                ca注册信息数组
        ca_id              caid
        bind_id            绑定id
        bind_type          绑定类型
        bind_info          绑定信息
        bind_name          绑定名称
        ctime              创建时间
说明
*/

php_begin();
$args = array("token");
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);

//检查la用户
la_user_check($token);

//获取ca审核列表
$ca_reg_table = ca_reg_table();
if(!$ca_reg_table)
    exit_error('101','没有ca注册记录');

//返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $ca_reg_table ;

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
