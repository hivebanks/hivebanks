<?php

require_once "../../../inc/common.php";
require_once "db/kyc_ba.php";
require_once  "db/la_admin.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*========================== ba地址审核列表 ==========================
GET参数
     token        用户token
返回
    errcode = 0          请求成功
    rows                安全信息组
        bind_type           绑定类型
        bind_name           绑定名称
        bind_info           绑定内容
        ctime               绑定时间
说明
*/

php_begin();
$args = array("token");
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);

//检查la用户
la_user_check($token);

//获取ba注册列表
$ba_reg_table = ba_address_list();
if(!$ba_reg_table)
    exit_error('101','没有ba地址记录');

//返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $ba_reg_table ;

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
