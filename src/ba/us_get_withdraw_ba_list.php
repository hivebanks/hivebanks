<?php

require_once '../inc/common.php';
require_once 'db/ba_rate_setting.php';
require_once "db/ba_base.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户请求提现列表(文件名待确认) ==========================
GET参数
  token           请求的用户token

返回
  rows         返回数组
   bit_type    数字货币种类
   base_rate   汇率
说明
*/
php_begin();
$args = array('token');
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);
//验证token
$us_id = check_token($token);
// 获取ba_type列表
$row = get_ba_withdraw_settting_rate_list_ba_id(date('Y-m-d H:i:s'));
$new_rows = array();
foreach ($row as $new_row){
    $new_row["base_rate"] = floatval($new_row["min(base_rate)"]);
    $new_rows[] = $new_row;
}
if(get_base_ba_list(BASE_CURRENCY)){
    $row_newp["base_rate"] = 1;
    $row_newp["bit_type"] = BASE_CURRENCY;
    array_push($new_rows,$row_newp);
}

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';

$rtn_ary['rows'] = $new_rows;

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
