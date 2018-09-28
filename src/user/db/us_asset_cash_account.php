<?php

//======================================
// 函数: 查询地址是否存在
// 参数: us_id              用户id
//      dataArr            地址的数组
// 返回: true                地址存在
// 返回: false               地址不存在
//======================================
function sel_us_asset_account_info($us_id,$lgl_address)
{
    $db = new DB_COM();
    $sql = "SELECT lgl_address FROM us_asset_cash_account WHERE us_id = '{$us_id}'";
    $db->query($sql);
    $rows = $db->fetchAll();
    if(empty($rows)){
        return false;
    }
    foreach ($rows as $row){
        if (json_decode($row['lgl_address'],true)["lgl_address"] == $lgl_address)
            return true;
    }
    return false;
}
//======================================
// 函数: 插入地址
// 参数: data_base             用户信息数组
//         us_id               用户id
//         cash_type           绑定类型
//         bind_flag           绑定标志
//         ctime               创建时间
//       dataArr               地址的数组
// 返回: true                    插入成功
// 返回: false                   插入失败
//======================================
function ins_us_asset_account_info($data_base)
{
    $db = new DB_COM();
    $sql = $db->sqlInsert("us_asset_cash_account", $data_base);
    $row = $db->query($sql);
    return $row;
}
//======================================
// 函数: 获取绑定的银行卡列表
// 参数: us_id               用户id
// 返回: rows                 所有银行信息数组
//======================================
function us_get_asset_account_info($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_asset_cash_account WHERE us_id = '{$us_id}'";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
//======================================
// 函数: 获取指定的银行卡列表
// 参数: us_id               用户id
//      cash_channel        渠道名
// 返回: rows                 所有银行信息数组
//======================================
function us_get_specified_asset_account_info($us_id,$cash_channel)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_asset_cash_account WHERE us_id = '{$us_id}' AND cash_channel = '{$cash_channel}'";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
//======================================
// 函数: 删除指定的银行卡
// 参数: us_id               用户id
//      ctime               添加时间
// 返回:

//======================================
function del_us_asset_account_info($us_id,$account_id)
{
    $db = new DB_COM();
    $sql = "DELETE FROM  us_asset_cash_account WHERE us_id = '{$us_id}' AND account_id = '{$account_id}'";
    $db->query($sql);
    $rows = $db->affectedRows();
    return $rows;
}
