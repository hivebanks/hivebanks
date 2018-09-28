<?php

require_once '../inc/common.php';
require_once 'db/ba_base.php';
require_once "db/la_base.php";
require_once 'db/com_option_config.php';
require_once 'db/base_asset_account.php';
require_once "../inc/transaction_order/la_ba_recharge.php";
//require_once 'db/us_ca_recharge_request.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 客户充值请求 ==========================
GET参数
  token          请求的用户token
  base_amount     数字货币金额
返回
  errcode = 0     请求成功
  bit_address     充值地址
说明
*/

php_begin();
$args = array("token", 'base_amount');
chk_empty_args('GET', $args);
// 用户token
$token = get_arg_str('GET', 'token', 128);
$base_amount = get_arg_str('GET', 'base_amount');

///验证token
$ba_id = check_token($token);


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
$bit_address_row = assign_ba_recharge_bit_account_info($base_ba_id,$ba_id);
if (!$bit_address_row)
    exit_error("141","基准ba地址不足");
$data["base_account_id"] = $bit_address_row["account_id"];

$type = 'recharge';
$utime = time();
$ctime = date('Y-m-d H:i:s');
$us_ip = get_ip();
$data['tx_hash'] = hash('md5', $ba_id . $type . $us_ip . $utime . $ctime);
$data["agent_id"] = $ba_id;
$data["base_id"] = $base_ba_id;
$data["base_amount"] = $base_amount * get_la_base_unit();
$data["tx_time"] = time();
$data["tx_type"] = "BA";
us_recharge_quest($data,$utime);
//返回给前端数据
$rtn_data['errcode'] = '0';
$rtn_data['errmsg'] = '';
$rtn_data['lgl_address'] = $bit_address_row["bit_address"];

php_end(json_encode($rtn_data));
