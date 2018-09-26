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
$all_block_tx_hash = get_recharge_quest_block_txhash($id);
foreach($all_block_tx_hash as $hash) {
    if($hash["block_tx_hash"] == $tx_hash) {
        exit_error("166", "已经存在的交易哈希，检查是否两次充值");
    }
}

$row = sel_us_recharge_info($tx_hash);
if(!$row) {
    exit_error(1, "该订单不存在");
}
if($row["qa_flag"] == 1 || $row["qa_flag"] == 2) {
    exit_error(1, "该订单已处理");
} elseif ($row["qa_flag"] ==3) {
    exit_error(1, "该订单已经被拒绝");
}





//将确认结果写入到数据库



