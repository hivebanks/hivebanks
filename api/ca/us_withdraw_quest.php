<?php
require_once '../inc/common.php';
require_once 'db/ca_base.php';
require_once 'db/us_base.php';
require_once "db/la_base.php";
require_once 'db/ca_rate_setting.php';
require_once 'db/ca_asset_account.php';
require_once 'db/us_asset_cash_account.php';
require_once 'db/us_ca_withdraw_request.php';
require_once "../inc/transaction_order/ca_withdraw.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 客户提现请求 ==========================
GET参数
  token          请求的用户token
  ca_id           代理商ID
  base_amount     数字货币金额
  ca_channel      ca渠道
  bit_amount      充值资产金额
  us_account_id   地址id
返回
  errcode = 0     请求成功
说明
*/

php_begin();
$args = array("token", 'ca_id', 'base_amount', "bit_amount","us_account_id","ca_channel");
chk_empty_args('GET', $args);
// 用户token
$token = get_arg_str('GET', 'token');
$ca_id = get_arg_str('GET', 'ca_id');
$base_amount = get_arg_str('GET', 'base_amount');
$lgl_amount = get_arg_str('GET', 'bit_amount');
$ca_channel = get_arg_str('GET', 'ca_channel');
$us_level = get_arg_str('GET', 'us_level');
$us_account_id = get_arg_str('GET', 'us_account_id');
// 是否有效

$us_id = check_token($token);
//$ca_channel_row = get_us_asset_cash_account_info($us_id,date("Y-m-d H:i:s"));
//判断金额，以及其他参数是否正确
$rate_row = get_ca_settting_withdraw_rate_ca_id($ca_id);

if (($rate_row["min_amount"] > $base_amount * get_la_base_unit() || $base_amount * get_la_base_unit() > $rate_row["max_amount"]))
    exit_error('123',"提现金额必须要在ca允许的金额以内");
//if (bccomp($base_amount , $lgl_amount / $rate_row["base_rate"],16))
//    exit_error(1, "汇率有所变化，请重新提交");
if ($us_level < $rate_row["us_level"])
    exit_error('125', "您的等级不满足ca的要求");
$us_row = get_us_base_info($us_id);
if ($us_row["base_amount"] < $base_amount)
    exit_error("126","用户余额不足");
$data = array();
$data["us_id"] = $us_id;
$data["ca_id"] = $ca_id;
$data["base_amount"] = $base_amount  * get_la_base_unit();
$data["tx_type"] = "2";
$data["lgl_amount"] = $lgl_amount;
$data["tx_time"] = time();
$data["us_account_id"] = $us_account_id;
$lgn_type = 'phone';
$utime = time();
$ctime = date('Y-m-d H:i:s');
$us_ip = get_ip();
$data['tx_hash'] = hash('md5', $ca_id . $lgn_type . $us_ip . $utime . $ctime);
//提现信息插入数据库
us_withdraw_quest($data);
exit_ok();
