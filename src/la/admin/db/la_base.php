<?php

//======================================
// 获取la的基本信息
// 参数:
// 返回: row         la基本信息数组
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
// 获取la的货币单位
// 参数:
// 返回: unit            货币单位
//======================================
function get_la_base_unit()
{
    $db = new DB_COM();
    $sql = "SELECT unit FROM la_base limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows["unit"];
}


