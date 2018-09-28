<?php

require_once '../inc/common.php';
require_once 'db/base_recharge_request.php';
require_once 'db/ba_asset_account.php';
require_once "db/la_base.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 代理用户充值记录查询 ==========================
GET参数
  token           用户TOKEN
  type            1:未处理，2：已处理，3：以拒绝

返回
total           总记录数
  rows          记录数组
    asset_id            充值资产ID
    qa_id               请求ID
    us_id               用户ID
    bit_address         数字货币充值地址
    bit_amount          数组货币金额
    base_amount         充值资产金额
    tx_hash             交易HASH
    tx_time             请求时间戳
    说明
*/

php_begin();
$args = array('token','type');
chk_empty_args('GET', $args);
// 用户token
$token = get_arg_str('GET', 'token', 128);
$page_num = get_arg_str('GET', 'page_num');
$page_size = get_arg_str('GET', 'page_size');
$type = get_arg_str('GET', 'type');
//验证token
$ba_id = check_token($token);
//获取充值列表基本信息
if ($type == '1') {
    $row = get_ba_recharge_request_ba_id($ba_id,'0');
}elseif ($type == '2') {
    $row = get_ba_recharge_request_ba_id($ba_id,'1');
}elseif ($type == '3'){
    $row = get_ba_recharge_request_ba_id($ba_id,'2');
}else {
    exit_error(1,"非法参数");
}


$new_rows = array();
foreach ($row as $for_row) {
    $new_row["base_amount"] = floatval($for_row["base_amount"] / get_la_base_unit());
    $new_row["tx_time"] = date('Y-m-d H:i', $for_row["tx_time"]);
    $new_row["tx_hash"] = $for_row["tx_hash"];
    $new_row["agent_id"] = $for_row["agent_id"];
    $new_row["qa_id"] = $for_row["qa_id"];
    $new_row["bit_address"] = get_ba_asset_account_ba_id($for_row["base_account_id"]);
    $new_rows[] = $new_row;
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary["rows"] = $new_rows;

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
