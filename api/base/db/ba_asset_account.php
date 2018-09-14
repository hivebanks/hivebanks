<?php

//======================================
// 函数: 获取ba的数字货币账号
// 参数: ba_id               用户id
//      base_ba_id          基准baid
// 返回: rows                信息数组
//======================================
function get_ba_bit_account_ba_id($base_ba_id, $ba_id)
{
    $db = new DB_COM();
    //充值信息存在，返回原先的地址
    $sql = "SELECT bind_flag,account_id,bit_address FROM ba_asset_account WHERE ba_id = '{$base_ba_id}' and bind_us_id = '{$ba_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    if ($rows["bind_flag"] == 1) {
        return $rows;
    }

    //分配新的地址
    $sql = "SELECT * FROM ba_asset_account WHERE ba_id = '{$base_ba_id}' and bind_flag = '0' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}

//======================================
// 函数: 获取ba的数字提现货币账号
// 参数: ba_id               用户id
//      base_ba_id          基准baid
// 返回: rows                信息数组
//======================================
function get_ba_withdraw_bit_account_ba_id($base_ba_id, $ba_id)
{
    $db = new DB_COM();
    //充值信息存在，返回原先的地址
    $sql = "SELECT bind_flag,account_id,bit_address FROM ba_asset_account WHERE ba_id = '{$ba_id}' and bind_us_id = '{$base_ba_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    if ($rows["bind_flag"] == 1) {
        return $rows;
    }

    //分配新的地址
    $sql = "SELECT * FROM ba_asset_account WHERE ba_id = '{$ba_id}' and bind_flag = '0' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}
//======================================
// 函数: 获取ba的数字提现货币账号
// 参数: account_id          账号id
// 返回: bit_address         数字货币地址
//======================================
function get_ba_asset_account_ba_id($account_id)
{
    $db = new DB_COM();
    $sql = "SELECT bit_address FROM base_asset_account WHERE account_id = '{$account_id}'";
    $db->query($sql);
    $bit_address = $db->getField($sql, 'bit_address');
    return $bit_address;
}