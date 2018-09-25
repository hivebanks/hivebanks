<?php

require_once '../inc/common.php';
require_once '../inc/transaction_order/ba_recharge.php';
require_once 'db/ba_base.php';
require_once 'db/la_base.php';
require_once 'db/ba_rate_setting.php';
require_once 'db/ba_asset_account.php';
require_once "db/base_asset_account.php";
require_once 'db/us_ba_recharge_request.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 客户充值请求 ==========================
GET参数
  token           请求的用户token
  ba_id           代理商ID
  base_amount     数字货币金额
  bit_type        币的种类
  bit_amount      充值资产金额
  us_level        用户等级
返回
  errcode = 0           请求成功
  bit_address          数字货币地址
  bit_address_qrcode   数字货币地址生成的二维码
说明
*/

php_begin();
$args = array("token", 'ba_id', 'base_amount', "bit_type", "bit_amount");
chk_empty_args('GET', $args);
// 用户token
//$us_id = get_arg_str('GET', 'us_id');
$ba_id = get_arg_str('GET', 'ba_id');
$base_amount = get_arg_str('GET', 'base_amount');
$bit_amount = get_arg_str('GET', 'bit_amount');
$bit_type = get_arg_str('GET', 'bit_type');
$us_level = get_arg_str('GET', 'us_level');
$token = get_arg_str('GET', 'token', 128);
//验证token
$us_id = check_token($token);

//判断金额，以及其他参数是否正确
$rate_row = get_ba_settting_recharge_rate_ba_id($ba_id);
//print_r($rate_row["base_rate"] * $base_amount."\n");
//print_r($bit_amount);
if ($bit_type != BASE_CURRENCY){
    if (($rate_row["min_amount"] > $base_amount * get_la_base_unit() || $base_amount*get_la_base_unit() > $rate_row["max_amount"]))
        exit_error('123', "充值金额必须要在ba允许的金额以内");
//if (bccomp($rate_row["base_rate"] * $base_amount, $bit_amount, 32))
//    exit_error(1, "汇率有所变化，请重新提交");
    if ($us_level < $rate_row["us_level"])
        exit_error('125', "您的等级不满足ba的要求");
}

$ba_row = get_ba_base_info($ba_id);
if ($ba_row["base_amount"] < $base_amount * get_la_base_unit())
    exit_error('126', "ba保证金不足，无法提交请求");
$data = array();
$data["us_id"] = $us_id;
$data["ba_id"] = $ba_id;
$data["base_amount"] = $base_amount * get_la_base_unit();
$data["bit_amount"] = $bit_amount;
$data["tx_time"] = time();
$data["asset_id"] = $bit_type;

//从地址db里获取account_id
//if ($bit_type != BASE_CURRENCY){
    $bit_address_row = get_ba_bit_account_ba_id($ba_id, $us_id);
    if (!$bit_address_row["account_id"])
        exit_error('127',"ba的地址不足");
//}else{
//    $bit_address_row = assign_ba_recharge_bit_account_info($ba_id,$us_id);
//    if (!$bit_address_row["account_id"])
//        exit_error('127',"ba的地址不足");
//}

$data["ba_account_id"] = $bit_address_row["account_id"];
$json_detail = array();
$json_detail["bit_address"] = $bit_address_row["bit_address"];
$data["tx_detail"] = json_encode($json_detail);
$lgn_type = 'phone';
$utime = time();
$ctime = date('Y-m-d H:i:s');
$us_ip = get_ip();
$data['tx_hash'] = hash('md5', $ba_id . $lgn_type . $us_ip . $utime . $ctime);
//if ($bit_type != BASE_CURRENCY){
    us_recharge_quest($data,$us_id,$utime);
//}else{
//    us_base_recharge_quest($data,$us_id,$utime);
//}

$rtn_data['errcode'] = '0';
$rtn_data['errmsg'] = '';
$rtn_data['bit_address'] = $bit_address_row["bit_address"];
php_end(json_encode($rtn_data));
