<?php

require_once '../../inc/common.php';
require_once '../../ba/db/us_ba_recharge_request.php';
require_once '../../ba/db/ba_asset_account.php';
require_once '../../ba/db/la_base.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/* * ==========================ba得到用户充值请求api=========================
 * GET参数：
 * id               id
 * apikey           ba用户的api key
 * type            充值类型
 *  返回：
 *total           总记录数
 *rows          记录数组
 *asset_id            充值资产
 *qa_id               请求ID
 *us_id               用户ID
 *bit_address         数字货币充值地址
 *bit_amount          数组货币金额
 *base_amount         充值资产金额
 *tx_time             请求时间戳
 *说明
 */


php_begin();
$args = array('ba_id','key');
chk_empty_args('GET', $args);

//得到参数
$id = get_arg_str('GET', 'ba_id', 128);
$type = get_arg_str('GET', 'type');
$key = get_arg_str('GET', 'key');

//TODO：验证key

//获取
if($type=='1') {
    $rows = get_ba_recharge_request_ba_id($id, '0');
} else{
    exit_error(1, "非法参数");
}


$recharge_quests = array();
foreach ($rows as $row) {
    $recharge_row['asset_id'] = $row["asset_id"];
    $recharge_row['bit_amount'] = floatval($row['bit_amount']);
    $recharge_row['tx_time'] = date('Y-m-d H:i:s', $row["tx_time"]);
    $recharge_row['tx_hash'] = $row['tx_hash'];
    $recharge_row['us_id'] = $row['us_id'];
    $recharge_row['bit_address'] = get_ba_asset_account_ba_id($row["ba_account_id"]);
    $recharge_quests[] = $recharge_row;
}
$json = array();
$json['errcode'] = '0';
$json['errmsg'] = '';
$json['handle_recharge'] = $recharge_quests;
$json = json_encode($json);
php_end($json);


