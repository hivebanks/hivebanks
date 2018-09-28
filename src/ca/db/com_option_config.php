<?php

//======================================
// 函数: 获取ca的渠道列表
// 参数:
// 返回: option_key            key值
//       option_value          值
//======================================
function  ca_get_ca_channel_list()
{
    $db = new DB_COM();
    //充值信息存在，返回原先的地址
    $sql = "SELECT option_key,option_value FROM com_option_config WHERE option_name = 'ca_channel' and sub_id = 'CA'";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
//======================================
// 函数: ca的渠道是否存在
// 参数:ca_channel   ca的渠道
// 返回: option_key            key值
//       option_value          值
//======================================
function ca_channel_exist_or_not($ca_channel){
    $db = new DB_COM();
    $sql = "SELECT * FROM com_option_config WHERE option_name = 'ca_channel' and option_key = '{$ca_channel}'";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 函数: ca是否可以注册
// 参数:
// 返回: row            信息数组
//======================================
function ca_can_reg_or_not(){
    $db = new DB_COM();
    $sql = "SELECT * FROM com_option_config WHERE option_name = 'ca_lock' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 函数: 获取ca基准货币类型
// 参数:
// 返回: row            信息数组
//======================================
function get_ca_valid_time(){
    $db = new DB_COM();
    $sql = "SELECT * FROM com_option_config WHERE option_name = 'ca_valid_rate_time' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
