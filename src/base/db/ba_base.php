<?php

//======================================
// 函数: 数字货币代理获取基准ba的汇率
// 参数: bit_type            数字货币类型
// 返回: ba_id               ba的id
//======================================
function  ba_get_base_ba_settting_rate_ba_id($bit_type)
{
    $db = new DB_COM();
    $sql = "SELECT ba_id FROM ba_base where ba_type = '{$bit_type}' order by base_amount desc limit 1";
    $db -> query($sql);
    $ba_id = $db -> getField($sql,'ba_id');
    return $ba_id;
}
//======================================
// 函数: 获取ba的基本信息
// 参数: ba_id          ba的id
// 返回: row            ba的信息数组
//======================================
function get_ba_base_info($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_base WHERE ba_id = '{$ba_id}' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
