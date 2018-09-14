<?php

require_once '../inc/common.php';
require_once 'db/us_ca_withdraw_request.php';
require_once 'db/us_asset_cash_account.php';
require_once "db/la_base.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 代理用户提现记录查询 ==========================
GET参数
    token           用户TOKEN
    type            1：未处理 2：已处理  3：拒绝
返回
    total           总记录数
    rows            记录数组
        qa_id               请求ID
        us_id               用户ID
        lgl_amount          法定货币金额
        base_amount         充值资产金额
        tx_time             请求时间戳
        tx_detail           交易描述
        tx_hash             交易hash
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
$ca_id = check_token($token);
// 通过id获取用户基本信息
if ($type == '1') {
    $row = get_ca_withdraw_request_ca_id($ca_id,"0");
}elseif ($type == '2') {
    $row = get_ca_withdraw_request_ca_id($ca_id,"1");
}elseif ($type == '3'){
    $row = get_ca_withdraw_request_ca_id($ca_id,"2");
}else {
    exit_error('131',"非法参数");
}
//获取提现列表基本信息

$new_rows = array();
foreach ($row as $for_row) {
    $new_row["bit_amount"] = floatval($for_row["lgl_amount"]);
    $new_row["base_amount"] = floatval($for_row["base_amount"] / get_la_base_unit());
    $new_row["tx_time"] = date('Y-m-d H:i', $for_row["tx_time"]);
    $new_row["us_id"] = $for_row["us_id"];
    $new_row["qa_id"] = $for_row["qa_id"];
    $new_row["tx_hash"] = $for_row["tx_hash"];
    $new_row["lgl_address"] = json_decode(get_us_asset_cash_account_info_by_account_id($for_row["us_account_id"])['lgl_address']);
    $new_rows[] = $new_row;
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary["rows"] = $new_rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
