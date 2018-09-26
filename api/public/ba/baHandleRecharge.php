<?php

require_once '../../inc/common.php';
require_once '../../ba/db/us_ba_recharge_request.php';
require_once '../../ba/db/ba_asset_account.php';
require_once '../../ba/db/la_base.php';
require_once '../db/us_ba_request_recharge.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");


php_begin();
$args = array('ba_id', 'tx_hash', 'block_tx_hash', 'key');

chk_empty_args('GET', $args);

//得到参数
$id = get_arg_str('GET', 'ba_id', 128);
$tx_hash = get_arg_str('GET', 'tx_hash');
$block_tx_hash = get_arg_str('GET', 'block_tx_hash');
$key = get_arg_str('key');


//TODO: 验证key



//验证blockhash 是否存在
$all_block_tx_hash = get_recharge_quest_block_txhash("5B26B745-FC8B-573F-EEB4-D8F05FAF0CD6");
foreach($all_block_tx_hash as $hash) {
    var_dump();
    if($hash["block_tx_hash"] == $tx_hash) {
        exit_error("166", "已经存在的交易哈希，检查是否两次充值");
    }
}



var_dump($all_block_tx_hash);
