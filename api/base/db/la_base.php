<?php

//======================================
// 函数: 获取la的基本信息
// 参数:
// 返回: row     信息数组
//======================================
function get_la_base_info()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM la_base";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 函数: 获取la的数字货币单位
// 参数:
// 返回: 数字货币单位
//======================================
function get_la_base_unit()
{
    $db = new DB_COM();
    $sql = "SELECT unit FROM la_base limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows["unit"];
}
//======================================
// 函数: 获取la的基准货币类型
// 参数:
// 返回: 数字货币类型
//======================================
function get_la_base_base_currency()
{
    $db = new DB_COM();
    $sql = "SELECT base_currency FROM la_base limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows["base_currency"];
}