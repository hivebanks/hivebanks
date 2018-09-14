<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/8/20
 * Time: 下午4:29
 */


require_once "../../../inc/common.php";
require_once "db/kyc_ca.php";
require_once  "db/la_admin.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*========================== ca地址审核列表 ==========================
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

//参数处理
php_begin();
$args = array("token");
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);

//检查la用户
la_user_check($token);

//获取ca地址审核列表
$ca_list = ca_address_list();
if(!$ca_list)
    exit_error('142','没有ca地址记录');

//返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $ca_list ;

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
