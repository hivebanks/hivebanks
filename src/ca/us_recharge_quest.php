<?php

require_once '../inc/common.php';
require_once 'db/ca_base.php';
require_once "db/la_base.php";
require_once 'db/ca_rate_setting.php';
require_once 'db/ca_asset_account.php';
require_once "../inc/transaction_order/ca_recharge.php";
require_once 'db/us_ca_recharge_request.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 客户充值请求 ==========================
GET参数
  token          请求的用户token
  ca_id           代理商ID
  base_amount     数字货币金额
  ca_channel      ca渠道
  bit_amount      充值资产金额
返回
  errcode = 0     请求成功
  recharge_rate   平均充值汇率
说明
*/

php_begin();
$args = array("token", 'ca_id', 'base_amount', "ca_channel", "bit_amount");
chk_empty_args('GET', $args);
// 用户token
$token = get_arg_str('GET', 'token', 128);
$ca_id = get_arg_str('GET', 'ca_id');
$base_amount = get_arg_str('GET', 'base_amount');
$bit_amount = get_arg_str('GET', 'bit_amount');
$ca_channel = get_arg_str('GET', 'ca_channel');
$us_level = get_arg_str('GET', 'us_level');
///验证token
$us_id = check_token($token);
//echo $base_amount;
//echo get_la_base_unit();
//判断金额，以及其他参数是否正确
$rate_row = get_ca_settting_recharge_rate_ca_id($ca_id);
if (($rate_row["min_amount"]  > $base_amount * get_la_base_unit() || $base_amount  * get_la_base_unit() > $rate_row["max_amount"]))
    exit_error('123',"充值金额必须要在ca允许的金额以内");
//if (bccomp($rate_row["base_rate"] * $base_amount , $bit_amount,16))
//    exit_error(1, "汇率有所变化，请重新提交");
if ($us_level < $rate_row["us_level"])
    exit_error('125', "您的等级不满足ca的要求");

$data = array();
$data["us_id"] = $us_id;
$data["ca_id"] = $ca_id;
$data["base_amount"] = $base_amount * get_la_base_unit();
$data["lgl_amount"] = $bit_amount;
$data["tx_time"] = time();
//从地址db里获取account_id
$bit_address_row = get_ca_bit_account_ca_id($ca_id,$us_id);
$data["ca_account_id"] = $bit_address_row["account_id"];
$data["tx_detail"] = $bit_address_row["lgl_address"];

$lgn_type = 'phone';
$utime = time();
$ctime = date('Y-m-d H:i:s');
$us_ip = get_ip();
$data['tx_hash'] = hash('md5', $ca_id . $lgn_type . $us_ip . $utime . $ctime);

us_recharge_quest($data,$us_id,$utime);
//返回给前端数据
$rtn_data['errcode'] = '0';
$rtn_data['errmsg'] = '';
$rtn_data['lgl_address'] = json_decode($bit_address_row["lgl_address"]);
php_end(json_encode($rtn_data));
