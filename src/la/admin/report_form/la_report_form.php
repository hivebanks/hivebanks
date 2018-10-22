<?php

require_once "../../../inc/common.php";
require_once "db/us_base.php";
require_once "db/ba_base.php";
require_once "db/ca_base.php";
require_once "db/la_base.php";
require_once "db/us_ba_recharge_request.php";
require_once "db/us_ba_withdraw_request.php";
require_once "db/us_ca_withdraw_request.php";
require_once "db/us_ca_recharge_request.php";
require_once  "db/la_admin.php";


/*
========================== 统计报表 ==========================
GET参数
  token             用户token
返回
rows            信息数组
    (all信息都会被返回)
说明
*/

php_begin();
$args = array("token");
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);

$key = Config::TOKEN_KEY;
// 获取token并解密
$des = new Des();
$decryption_code = $des -> decrypt($token, $key);
$now_time = time();
$code_conf =  explode(',',$decryption_code);
// 获取token中的需求信息
$user = $code_conf[0];
$timestamp = $code_conf[1];
if($timestamp < $now_time){
    exit_error('114','Token timeout please retrieve!');
}
//判断la是否存在
$row = get_la_by_user($user);
if(!$row){
    exit_error('112','用户不存在');
}

//TODO:添上时间限制
$begin_limit_time =  get_arg_str('GET', 'begin_limit_time');
$end_limit_time =  get_arg_str('GET', 'end_limit_time');

//得到基本单位
$unit = get_la_base_unit()['unit'];

//$begin_limit_time = $begin_limit_time ? $begin_limit_time : 0;
//$end_limit_time = $end_limit_time ? $end_limit_time : 0;
$rows = array();
//user的总帐
$row = get_us_sum_amout_info();
$rows["sum_us_base_amount"] =  $row['sum(base_amount)'] / $unit;
$rows["sum_us_lock_amount"] =  $row['sum(lock_amount)'] / $unit; 

//ba的总账
$row = get_ba_sum_amout_info();
$rows["sum_ba_base_amount"] =  $row['sum(base_amount)'] / $unit;
$rows["sum_ba_lock_amount"] =  $row['sum(lock_amount)'] / $unit;

//ca的总账
$row = get_ca_sum_amout_info();
$rows["sum_ca_base_amount"] =  $row['sum(base_amount)'] / $unit;
$rows["sum_ca_lock_amount"] =  $row['sum(lock_amount)'] / $unit;


$rows["sum_ba_recharge_base_amount"] = get_ba_sum_us_ba_recharge_request_info($begin_limit_time,$end_limit_time)["sum(base_amount)"] / $unit;
$rows["sum_ba_withdraw_base_amount"] = get_ba_sum_us_ba_withdraw_request_info($begin_limit_time,$end_limit_time)["sum(base_amount)"] / $unit;
$rows["sum_ca_recharge_base_amount"] = get_sum_us_ca_recharge_request_info($begin_limit_time,$end_limit_time)["sum(base_amount)"] / $unit;
$rows["sum_ca_withdraw_base_amount"] = get_sum_us_ca_withdraw_request_info($begin_limit_time,$end_limit_time)["sum(base_amount)"] / $unit;
$rows["sum_us_recharge_base_amount"] = get_ba_sum_us_ba_recharge_request_info($begin_limit_time,$end_limit_time)["sum(base_amount)"]  / $unit + get_sum_us_ca_recharge_request_info($begin_limit_time,$end_limit_time)["sum(base_amount)"] / $unit;
$rows["sum_us_withdraw_base_amount"] = get_ba_sum_us_ba_withdraw_request_info($begin_limit_time,$end_limit_time)["sum(base_amount)"]  / $unit + get_sum_us_ca_withdraw_request_info($begin_limit_time,$end_limit_time)["sum(base_amount)"] / $unit;
$rows["ba_register_count"] = get_ba_sum_register_amout_info($begin_limit_time,$end_limit_time)["count(*)"];
$rows["us_register_count"] = get_us_sum_register_amout_info($begin_limit_time,$end_limit_time)["count(*)"];
$rows["ca_register_count"] = get_ca_sum_register_amout_info($begin_limit_time,$end_limit_time)["count(*)"];


$row = get_ba_recharge_amount_from_us_ba_recharge_request($begin_limit_time,$end_limit_time);
$sum_ba_recharge_list_by_ba_id_arr = array();
foreach ($row as $new_row){
    $news_row["ba_id"] =  $new_row['ba_id'];
    $news_row["ba_amount"] =  $new_row['sum(base_amount)'];
    $sum_ba_recharge_list_by_ba_id_arr[] = $news_row;
}
$rows["sum_ba_recharge_list_by_ba_id"] = $sum_ba_recharge_list_by_ba_id_arr;

$row = get_ba_withdraw_amount_from_us_ba_withdraw_request($begin_limit_time,$end_limit_time);
$sum_ba_withdraw_list_by_ba_id_arr = array();
foreach ($row as $new_row){
    $news_row["ba_id"] =  $new_row['ba_id'];
    $news_row["ba_amount"] =  $new_row['sum(base_amount)'];
    $sum_ba_withdraw_list_by_ba_id_arr[] = $news_row;
}
$rows["sum_ba_withdraw_list_by_ba_id"] = $sum_ba_withdraw_list_by_ba_id_arr;

$row = get_ca_recharge_amount_from_us_ca_recharge_request($begin_limit_time,$end_limit_time);
$sum_ca_recharge_list_by_ba_id_arr = array();
foreach ($row as $new_row){
    $news_row["ba_id"] =  $new_row['ca_id'];
    $news_row["ba_amount"] =  $new_row['sum(base_amount)'];
    $sum_ca_recharge_list_by_ba_id_arr[] = $news_row;
}
$rows["sum_ca_recharge_list_by_ca_id"] = $sum_ca_recharge_list_by_ba_id_arr;

$row = get_ca_withdraw_amount_from_us_ca_recharge_request($begin_limit_time,$end_limit_time);
$sum_ca_withdraw_list_by_ca_id_arr = array();
foreach ($row as $new_row){
    $news_row["ba_id"] =  $new_row['ca_id'];
    $news_row["ba_amount"] =  $new_row['sum(base_amount)'];
    $sum_ca_withdraw_list_by_ca_id_arr[] = $news_row;
}
$rows["sum_ca_withdraw_list_by_ca_id"] = $sum_ca_withdraw_list_by_ca_id_arr;


//$rows["sum_us_recharge_list_by_us_id"] = get_us_recharge_amount_from_us_ba_recharge_request();
//$rows["sum_us_withdraw_list_by_ba_id"] = get_us_recharge_amount_from_us_ca_recharge_request();

$sum_bit_type_recharge_row = get_ba_us_ba_recharge_request_info($begin_limit_time,$end_limit_time);
//中间数组
$new_rows_recharge = array();
foreach ($sum_bit_type_recharge_row as $new_row){
    $row_new["sum_of_bit_type_recharge"] =  $new_row['sum(base_amount)'];
    $row_new["asset_id"] =  $new_row['asset_id'];
    $new_rows_recharge[] = $row_new;
}
$rows["sum_bit_type_recharge_row"] = $new_rows_recharge;

$sum_bit_type_withdraw_row = get_ba_us_ba_withdraw_request_info($begin_limit_time,$end_limit_time);
//中间数组
$new_rows_withdraw = array();
foreach ($sum_bit_type_withdraw_row as $new_row_withdraw){
    $row_news["sum_of_bit_type_withdraw"] =  $new_row_withdraw['sum(base_amount)'];
    $row_news["asset_id"] =  $new_row_withdraw['asset_id'];
    $new_rows_withdraw[] = $row_news;
}
$rows["sum_bit_type_withdraw_row"] = $new_rows_withdraw;

//总给送
$gift = gift_data();
$rows['gift_row'] = $gift;

//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
