<?php

require_once '../inc/common.php';
require_once 'db/ca_rate_setting.php';
require_once 'db/ca_asset_account.php';
require_once "db/la_base.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取充值提现汇率 ==========================
 GET参数
   token                    用户token
返回
   new_rtn_arr             充值提现数组
     rtn_withdraw_row         用户提现汇率数组
        withdraw_min_amount   最小金额
        withdraw_max_amount   最大金额
        withdraw_us_level     用户等级
        withdraw_set_time     有效时间
        withdraw_ca_channel   ca提现的渠道
        withdraw_base_rate    基础汇率
     rtn_recharge_row         用户充值汇率数组
        recharge_min_amount   最小金额
        recharge_max_amount   最大金额
        recharge_us_level     用户等级
        recharge_set_time     有效时间
        recharge_ca_channel   ca充值的渠道
        recharge_base_rate    基础汇率

说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);
// 用户token
$token = get_arg_str('GET', 'token', 128);
//验证token
$ba_id = check_token($token);
// 通过id获取用户基本信息
$rows = ca_get_distinct_ca_channel_list();
$new_rtn_arr = array();
foreach ($rows as $row){
    $news_row = array();
    $news_row['ca_channel'] = strtoupper($row['ca_channel']);
    $recharge_row = get_ca_settting_recharge_rate_ca_id($ba_id,$row['ca_channel']);
    $rtn_recharge_row = array();
    $rtn_recharge_row['ba_id'] = $ba_id;
    $rtn_recharge_row['recharge_min_amount'] = floatval($recharge_row['min_amount']) * $recharge_row['base_rate'] / get_la_base_unit();
    $rtn_recharge_row['recharge_max_amount'] = floatval($recharge_row['max_amount']) * $recharge_row['base_rate'] / get_la_base_unit();
    $rtn_recharge_row['recharge_us_level'] = $recharge_row['us_level'];
//    $rtn_recharge_row['recharge_set_time'] = date('Y-m-d H:i', $recharge_row['set_time']);
    $rtn_recharge_row['recharge_set_time'] = $recharge_row['limit_time'];
    $rtn_recharge_row['recharge_ca_channel'] = $recharge_row['ca_channel'];
    $rtn_recharge_row['recharge_base_rate'] = floatval($recharge_row['base_rate']);
    $news_row['recharge_row'] = $rtn_recharge_row;
    $withdraw_row = get_ca_settting_withdraw_rate_ca_id($ba_id,$row['ca_channel']);
    $rtn_withdraw_row = array();
    $rtn_withdraw_row['ba_id'] = $ba_id;
    if ($withdraw_row['base_rate']) {
        $rtn_withdraw_row['withdraw_min_amount'] = floatval($withdraw_row['min_amount'] * $recharge_row['base_rate'] / get_la_base_unit());
        $rtn_withdraw_row['withdraw_max_amount'] = floatval($withdraw_row['max_amount'] * $recharge_row['base_rate'] / get_la_base_unit());
    }
    $rtn_withdraw_row['withdraw_us_level'] = $withdraw_row['us_level'];
//    $rtn_withdraw_row['withdraw_set_time'] = date('Y-m-d H:i', $withdraw_row['set_time']);
    $rtn_withdraw_row['withdraw_set_time'] = $withdraw_row['limit_time'];
    $rtn_withdraw_row['withdraw_ca_channel'] = $withdraw_row['ca_channel'];
    $rtn_withdraw_row['withdraw_base_rate'] = floatval($withdraw_row['base_rate']);
    $new_row['ca_channel'] = $row['ca_channel'];
    $news_row['withdraw_row'] = $rtn_withdraw_row;
    $new_rtn_arr[] = $news_row;
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $new_rtn_arr;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
