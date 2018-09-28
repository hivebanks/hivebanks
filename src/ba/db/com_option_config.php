<?php

//======================================
// 函数: 获取ba数字货币列表
// 参数:
// 返回: rows           ba的列表
//======================================
function get_ba_bit_type()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM com_option_config WHERE option_name = 'bit_type' and status = 1";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
//======================================
// 函数:  判断数字货币类型是否开启
// 参数:
// 返回: rows           数字货币开启的信息数组
//======================================
function bit_type_exist_or_not($bit_type){
    $db = new DB_COM();
    $sql = "SELECT * FROM com_option_config WHERE option_name = 'bit_type' and option_key = '{$bit_type}'";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 函数:  判断数字代理注册是否开启
// 参数:
// 返回: rows           数字代理开启的信息
//======================================
function ba_can_reg_or_not(){
    $db = new DB_COM();
    $sql = "SELECT * FROM com_option_config WHERE option_name = 'ba_lock' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 函数:  数字货币代理汇率设定的默认时间
// 参数:
// 返回: rows           数字代理汇率默认时间的信息
//======================================
function get_ba_valid_time(){
    $db = new DB_COM();
    $sql = "SELECT * FROM com_option_config WHERE option_name = 'ba_valid_rate_time' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
