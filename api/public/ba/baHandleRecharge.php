<?php

require_once '../../inc/common.php';
require_once '../../ba/db/us_ba_recharge_request.php';
require_once '../../ba/db/ba_asset_account.php';
require_once '../../ba/db/la_base.php';

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




//

