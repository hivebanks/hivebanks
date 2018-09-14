<?php

//======================================
// 函数: 分配ba充值帐户信息
// 参数: base_id            基准ba的id
//      ba_id               数字货币代理
// 返回: rows                信息数组
//======================================
function assign_ba_recharge_bit_account_info($base_id, $ba_id)
{

    $db = new DB_COM();
    //充值信息存在，返回原先的地址
    $sql = "SELECT bind_flag,account_id,bit_address FROM base_asset_account WHERE base_id = '{$base_id}' and bind_agent_id = '{$ba_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow($sql);
    if ($rows["bind_flag"] == 1) {
        return $rows;
    }
    //分配新的地址
    $sql = "SELECT * FROM base_asset_account WHERE base_id = '{$base_id}' and bind_flag = '0' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;

}



function ins_ba_recharge_bit_account_info($data_base)
{
    $db = new DB_COM();

    $sql = $db->sqlInsert("base_asset_account", $data_base);
    if (!$db->query($sql))
        return false;
    return true;

}

function sel_ba_recharge_bit_account_info($ba_id, $bit_address)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM base_asset_account WHERE base_id = '{$ba_id}' and bit_address = '{$bit_address}'";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}

function get_ba_recharge_bit_account_info($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM base_asset_account WHERE base_id = '{$ba_id}'";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}

