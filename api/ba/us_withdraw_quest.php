<?php

require_once '../inc/common.php';
require_once 'db/ba_base.php';
require_once 'db/us_base.php';
require_once 'db/la_base.php';
require_once '../inc/transaction_order/ba_withdraw.php';
require_once 'db/ba_rate_setting.php';
require_once 'db/ba_asset_account.php';
require_once 'db/us_ba_withdraw_request.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 客户提现请求 ==========================
GET参数
  token           请求的用户token
  ba_id           代理商ID
  base_amount     数字货币金额
  bit_type        币的种类
  bit_amount      充值资产金额
  us_level        用户等级

返回
  errcode = 0     请求成功
说明
*/

php_begin();
$args = array("token", 'ba_id', 'base_amount', "bit_type", "bit_amount", "bit_address");
chk_empty_args('GET', $args);

//$us_id = get_arg_str('GET', 'us_id');
$ba_id = get_arg_str('GET', 'ba_id');
$base_amount = get_arg_str('GET', 'base_amount');
$bit_amount = get_arg_str('GET', 'bit_amount');
$bit_address = get_arg_str('GET', 'bit_address');
$bit_type = get_arg_str('GET', 'bit_type');
$us_level = get_arg_str('GET', 'us_level');
$token = get_arg_str('GET', 'token', 128);
//验证token
$us_id = check_token($token);

//判断金额，以及其他参数是否正确
$rate_row = get_ba_settting_withdraw_rate_ba_id($ba_id);
if ($bit_type != BASE_CURRENCY){

    if (($rate_row["min_amount"] > $base_amount * get_la_base_unit() || $base_amount * get_la_base_unit() > $rate_row["max_amount"]))
        exit_error('123', "提现金额必须要在ba允许的金额以内");
//if (bccomp($base_amount, $bit_amount * $rate_row["base_rate"], 16))
//    exit_error(1, "汇率有所变化，请重新提交");
    if ($us_level < $rate_row["us_level"])
        exit_error('125', "您的等级不满足ba的要求");
}

$us_row = get_us_base_info($us_id);
if ($us_row["base_amount"] < $base_amount * get_la_base_unit())
    exit_error("127", "用户余额不足");
$data = array();
$data["us_id"] = $us_id;
$data["ba_id"] = $ba_id;
$data["base_amount"] = $base_amount * get_la_base_unit();
$data["tx_type"] = "2";
$data["bit_amount"] = $bit_amount;
$data["tx_time"] = time();
$data["asset_id"] = $bit_type;
$data["us_account_id"] = "1";
$json_detail = array();
$json_detail["bit_address"] = $bit_address;
$data["tx_detail"] = json_encode($json_detail);
$lgn_type = 'phone';
$utime = time();
$ctime = date('Y-m-d H:i:s');
$us_ip = get_ip();
$data['tx_hash'] = hash('md5', $ba_id . $lgn_type . $us_ip . $utime . $ctime);

us_withdraw_quest($data);
exit_ok();
