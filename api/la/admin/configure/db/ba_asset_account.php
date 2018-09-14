<?php

////======================================
////  获取
//// 参数: base_ba_id   基准baid
////       ba_id        ba_id
//// 返回: row          基准货币代理商保证金账号信息
////======================================
//function get_ba_bit_account_ba_id($base_ba_id, $ba_id)
//{
//    $db = new DB_COM();
//    //充值信息存在，返回原先的地址
//    $sql = "SELECT bind_flag,account_id,bit_address FROM ba_asset_account WHERE ba_id = '{$base_ba_id}' and bind_us_id = '{$ba_id}' limit 1";
//    $db->query($sql);
//    $rows = $db->fetchRow();
//    if ($rows["bind_flag"] == 1) {
//        return $rows;
//    }
//    //分配新的地址
//    $sql = "SELECT * FROM ba_asset_account WHERE ba_id = '{$base_ba_id}' and bind_flag = '0' limit 1";
//    $db->query($sql);
//    $rows = $db->fetchRow();
//    return $rows;
//}
//======================================
//  获取ba提现地址
// 参数: base_ba_id   基准baid
//       ba_id        ba_id
// 返回: row          给ba分配的新地址
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
