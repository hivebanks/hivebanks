<?php

//======================================
// 用户获取渠道列表
// 参数:
// 返回: option_key           渠道key
//      option_value          渠道全称
//======================================
function  us_get_us_channel_list()
{
    $db = new DB_COM();
    //充值信息存在，返回原先的地址
    $sql = "SELECT option_key,option_value FROM com_option_config WHERE option_name = 'ca_channel' and sub_id = 'CA'";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
//======================================
// 用户是否允许注册
// 参数:
// 返回: row           信息数组
//======================================
function us_can_reg_or_not(){
    $db = new DB_COM();
    $sql = "SELECT * FROM com_option_config WHERE option_name = 'user_lock' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
