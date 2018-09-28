<?php

//======================================
// 函数: ba基准货币代理充值写入数据库
// 参数: data_base              信息数组
// 返回: true                   成功
//       false                 失败
//======================================
function ins_ba_recharge_bit_account_info($data_base)
{
    $db = new DB_COM();
    $sql = $db->sqlInsert("base_asset_account", $data_base);
    if (!$db->query($sql))
        return false;
    return true;
}
//======================================
// 函数: 判断该基准ba地址是否重复
// 参数: ba_id                 baID
//       bit_address           绑定地址信息
// 返回: row                   ba充值基准货币地址数组
//======================================
function sel_ba_recharge_bit_account_info($ba_id, $bit_address)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM base_asset_account WHERE base_id = '{$ba_id}' and bit_address = '{$bit_address}'";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 函数: 获取基准ba地址
// 参数: ba_id                 baID
// 返回: row                   ba充值基准货币地址数组
//======================================
function get_ba_recharge_bit_account_info($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM base_asset_account WHERE base_id = '{$ba_id}'";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
//======================================
// 函数: 获取基准ba地址
// 参数: ba_id                 baID
//       base_id               代理id
// 返回: rows                   信息数组
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
