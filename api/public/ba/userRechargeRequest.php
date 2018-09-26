<?php

require_once '../inc/common.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
 * ==========================ba得到用户充值请求=========================
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
$args = array('ba_id','key', );
chk_empty_args('GET', $args);

//