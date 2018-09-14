<?php

//======================================
//  获取ba绑定的数字货币地址
// 参数: ba_id        ba_id
// 返回: row          数字货币地址信息数组
//======================================
function get_ba_bind_bit_address($ba_id){
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_bind WHERE ba_id = '{$ba_id}' AND  bind_name = 'bit_address' and bind_flag = 1 limit 1";
    $db->query($sql);
    $row = $db ->fetchRow();
    return $row;
}
