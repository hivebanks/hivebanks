<?php
require_once '../../inc/common.php';
require_once '../db/us_ba_request_recharge.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

$all_blcok_tx_hash = get_recharge_quest_block_txhash("5B26B745-FC8B-573F-EEB4-D8F05FAF0CD6");



var_dump($all_blcok_tx_hash);
