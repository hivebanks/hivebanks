<?php

require_once "../../../inc/common.php";
require_once "../db/com_option_config.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 注册列表锁定 ==========================
GET参数
    type             锁定类型（us,ba,ca）
返回
    errcode = 0      请求成功
    option_name      选项名称
    option_value     选项值
说明a
*/

php_begin();
$args = array('type');
chk_empty_args('GET', $args);

$type = get_arg_str('GET', 'type', 255);
$res = www_reg_permission($type);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $res;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
