<?php

//======================================
// 获取ca绑定的地址信息
// 参数: ca_id          ca的ID
// 返回: row            地址信息数组
//======================================
function get_ca_bind_bit_address($ca_id){
    $db = new DB_COM();
    $sql = "SELECT bind_info FROM ca_bind WHERE ca_id = '{$ca_id}' AND  bind_name = 'bit_address' and bind_flag = 1";
    $db->query($sql);
    $row = $db ->fetchAll();
    return $row;
}
