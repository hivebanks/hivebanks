<?php

require_once '../inc/common.php';
require_once 'db/ca_rate_setting.php';
require_once "db/la_base.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取渠道列表以及最低提现汇率 ==========================
GET参数
  token            请求的用户token
  bit_amount       法定货币金额
返回
  errcode = 0     请求成功
   rows           符合的ca列表
    ca_channel    ca的渠道
    base_rate     汇率
说明
*/

php_begin();
$args = array("token","base_amount");
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
//验证token
$ca_id = check_token($token);
$base_amount = get_arg_str('GET', 'base_amount') * get_la_base_unit();
$rows= get_ca_withdraw_settting_rate_list_by_bit_amount($base_amount,date('Y-m-d H:i:s'));
$new_rows = array();
foreach ($rows as $new_row){
    $new_rwo["base_rate"] = floatval($new_row["max(base_rate)"]);
    $new_rwo["ca_channel"] = $new_row["ca_channel"];
    $new_rows[] = $new_rwo;
}
//返回给前端数据
$rtn_data['errcode'] = '0';
$rtn_data['errmsg'] = '';
$rtn_data['rows'] = $new_rows;
php_end(json_encode($rtn_data));
