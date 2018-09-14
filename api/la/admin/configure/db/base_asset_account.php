<?php

//======================================
// 查询ba重置保证金地址信息
// 参数: base_id      基准baid
//       ba_id        ba_id
// 返回: row          基准货币代理商保证金账号信息
//======================================
function sel_ba_recharge_bit_account_info($base_id, $ba_id)
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

