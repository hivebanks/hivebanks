<?php
require_once '../../inc/common.php';
require_once '../db/us_ba_request_recharge.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
$all_blcok_tx_hash = get_recharge_quest_block_txhash("5B26B745-FC8B-573F-EEB4-D8F05FAF0CD6");


foreach ($all_blcok_tx_hash as $hash) {
    var_dump($hash["block_tx_hash"]);
}
*/


$row = sel_recharge_info("ddc9367182f3d2d518f241f11eb1c432");

var_dump($row);
