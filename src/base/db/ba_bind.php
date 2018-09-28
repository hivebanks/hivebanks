<?php

//======================================
// 函数: 获取ba的数字货币地址
// 参数: ba_id             ba的id
// 返回: row               数字货币地址信息数组
//======================================
function get_ba_bind_bit_address($ba_id){
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_bind WHERE ba_id = '{$ba_id}' AND  bind_name = 'bit_address' and bind_flag = 1 limit 1";
    $db->query($sql);
    $row = $db ->fetchRow();
    return $row;
}

//======================================
// 函数: 获取用户资金密码hash
// 参数: us_id            用户id
//       pass             绑定类型
// 返回: pass_hash        用户资金密码hash
//======================================
function get_pass_hash($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT bind_info FROM ba_bind WHERE ba_id = '{$ba_id}' AND  bind_name = 'pass_hash' AND bind_flag = '1'";
    $db->query($sql);
    $pass_hash = $db->getField($sql,'bind_info');
    return $pass_hash;
}