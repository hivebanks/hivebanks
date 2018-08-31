<?php
//======================================
// 函数: 获取la配置的key
// 参数:
// 返回: $row        最新信息数组
//======================================
function get_token_key()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM com_option_config WHERE option_name = 'api_key' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}
//======================================
// 函数: 获取la的基准链接
// 参数:
// 返回: row        最新信息数组
//======================================
function get_la_base_url(){
    $db = new DB_COM();
    $sql = "SELECT h5_url,api_url FROM la_base limit 1";
    $db -> query($sql);
    $row = $db ->fetchRow();
    return $row;
}
//======================================
// 函数: 获取la的基准单位
// 参数:
// 返回: unit        基准单位
//======================================
function get_base_unit()
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
// 返回: base_currency      基准货币类型
//======================================
function get_base_currency()
{
    $db = new DB_COM();
    $sql = "SELECT base_currency FROM la_base limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows["base_currency"];
}