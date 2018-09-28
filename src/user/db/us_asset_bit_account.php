<?php

//======================================
// 函数: 获取指定数字货币类型的地址
// 参数: us_id        用户id
//       bit_type    数字货币类型
// 返回: bit_address  数字货币地址
//======================================
function get_us_bit_address($us_id,$bit_type)
{
    $db = new DB_COM();
    $sql = "SELECT bit_address,account_id FROM us_asset_bit_account WHERE us_id = '{$us_id}' AND  bit_type = '{$bit_type}' AND bind_flag = '1'";
    $db->query($sql);
    $row = $db -> fetchRow();
    return $row;
}
//======================================
// 函数: 把指定数字货币类型的地址设为不可用
// 参数: us_id         用户id
//       bit_type     数字货币类型
// 返回:  count        影响的行数
//======================================
 function set_used_bit_address($us_id,$bit_type)
 {
     $db = new DB_COM();
     $sql = "UPDATE us_asset_bit_account SET bind_flag = '9' WHERE us_id = '{$us_id}' AND bit_type = '{$bit_type}'";
     $db -> query($sql);
     $count = $db -> affectedRows();
     return $count;
 }
//======================================
// 函数: 插入指定数字货币类型的地址
// 参数: us_id              用户id
//       data_bind         数据数组
// 返回:  0                 失败
////       insID           成功
//======================================
function ins_us_bit_address($data_bind)
{
    $db = new DB_COM();
    $sql = $db->sqlInsert("us_asset_bit_account", $data_bind);
    $db->query($sql);
    $count = $db -> affectedRows();
    return $count;
}
//======================================
// 函数: 查询地址是否存在
// 参数: us_id               用户id
// 返回: bit_address         数字货币地址
//======================================
function sel_us_asset_bit_account_info($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_asset_bit_account WHERE us_id = '{$us_id}' ";
    $db->query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
//======================================
// 函数: 插入地址
// 参数: data_bind_pass             用户信息数组
//======================================
function ins_us_asset_bit_account_info($data_bind_pass)
{
    $db = new DB_COM();
    $sql = $db->sqlInsert("us_asset_bit_account", $data_bind_pass);
    $row = $db->query($sql);
    return $row;
}
