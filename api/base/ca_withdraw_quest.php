<?php

require_once '../inc/common.php';
require_once 'db/ca_base.php';
require_once 'db/ca_bind.php';
require_once "db/la_base.php";
require_once 'db/com_option_config.php';
require_once 'db/ba_asset_account.php';
require_once "db/ba_base.php";
require_once "../inc/transaction_order/la_ca_withdraw.php";
//require_once 'db/us_ca_recharge_request.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 客户ca提现请求 ==========================
GET参数
  token          请求的用户token
  base_amount     数字货币金额
  fun_pass        资金密码
返回
  errcode = 0     请求成功
说明
*/

php_begin();
$args = array("token", 'base_amount','fun_pass');
chk_empty_args('GET', $args);
// 用户token
$token = get_arg_str('GET', 'token', 128);
$base_amount = get_arg_str('GET', 'base_amount');
$fun_pass = get_arg_str('GET', 'fun_pass');

///验证token
$ca_id = check_token($token);


if(!get_pass_hash($ca_id))
    exit_error('106','资金密码未绑定');
if(get_pass_hash($ca_id) == $fun_pass)
    exit_error('102','资金密码不正确');

////判断金额，以及其他参数是否正确
//$rate_row = get_ca_settting_recharge_rate_ca_id($ca_id);
//if (($rate_row["min_amount"]  > $base_amount * get_la_base_unit() || $base_amount  * get_la_base_unit() > $rate_row["max_amount"]))
//    exit_error('123',"充值金额必须要在ca允许的金额以内");
////if (bccomp($rate_row["base_rate"] * $base_amount , $bit_amount,16))
////    exit_error(1, "汇率有所变化，请重新提交");
//if ($us_level < $rate_row["us_level"])
//    exit_error('125', "您的等级不满足ca的要求");

$data = array();

//从地址db里获取account_id

$la_row = get_la_base_info();

$base_ba_id = ba_get_base_ba_settting_rate_ba_id($la_row["base_currency"]);
$bit_address_row = get_ca_bind_bit_address($ca_id);
if (!$bit_address_row)
    exit_error("142","您的地址不足");
$data["agent_account_id"] = $bit_address_row["bind_id"];

$type = 'withdraw';
$utime = time();
$ctime = date('Y-m-d H:i:s');
$us_ip = get_ip();
$data['tx_hash'] = hash('md5', $ca_id . $type . $us_ip . $utime . $ctime);
$data["agent_id"] = $ca_id;
$data["base_id"] = $base_ba_id;
$data["base_amount"] = $base_amount * get_la_base_unit();
$data["tx_time"] = time();
$data["tx_type"] = "CA";
us_withdraw_quest($data,$utime);
//返回给前端数据
exit_ok();
