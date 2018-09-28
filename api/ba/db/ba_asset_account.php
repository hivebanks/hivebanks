<?php
/*
 * 函数：根据ba分配用户地址时的account_id，来查询该用户的充值地址
 * 参数：account_id                账户id
 * 返回：bit_address               充值数字货币的地址
 */
function get_user_recharge_address($account_id)
{
    $db = new DB_COM();
    $sql = "SELECT bit_address FROM ba_asset_account WHERE account_id = '{$account_id}'";
    $db->query($sql);
    $bit_address = $db->getField($sql, 'bit_address');
    return $bit_address;
}