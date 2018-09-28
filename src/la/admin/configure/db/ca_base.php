<?php

//======================================
// ca获取基准ba设定的重置汇率通过ca_id
// 参数:  bit_type     货币类型
// 返回: ba_id         ba的id
//======================================
function  ca_get_base_ba_settting_rate_ca_id($bit_type)
{
    $db = new DB_COM();
    $sql = "SELECT ba_id FROM ba_base where ba_type = '{$bit_type}' order by base_amount desc limit 1";
    $db -> query($sql);
    $ba_id = $db -> getField($sql,'ba_id');
    return $ba_id;
}
//======================================
// ca获取基准ba设定的提现汇率通过ca_id
// 参数:  bit_type     货币类型
//        ca_id        ca_id
// 返回: rows           获取的信息数组
//======================================
function get_ca_withdraw_bit_account_ca_id($base_ba_id, $ca_id)
{
    $db = new DB_COM();
    //充值信息存在，返回原先的地址
    $sql = "SELECT bind_flag,account_id,bit_address FROM ba_asset_account WHERE ba_id = '{$ca_id}' and bind_us_id = '{$base_ba_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    if ($rows["bind_flag"] == 1) {
        return $rows;
    }

    //分配新的地址
    $sql = "SELECT * FROM ba_asset_account WHERE ba_id = '{$ca_id}' and bind_flag = '0' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}

