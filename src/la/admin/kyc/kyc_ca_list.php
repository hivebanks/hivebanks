<?php

require_once "../../../inc/common.php";
require_once "db/kyc_ca.php";
require_once  "db/la_admin.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*========================== 获取ca认证列表 ==========================
GET参数
    token        用户token
返回
    errcode = 0     请求成功
    rows             ca注册信息数组
    ca_id            caid
    bind_id          绑定id
    bind_type        绑定类型
    bind_info        绑定信息
    bind_name         绑定名称
    ctime            创建时间

说明

*/

php_begin();
$args = array("token");
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);

//检查la用户
la_user_check($token);

//获取ca绑定列表
$data_idcard = kyc_ca_bind_idcard_list();

//返回数据

if(!$data_idcard)
    exit_error('404','没有数据');

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $data_idcard;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);