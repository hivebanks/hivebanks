<?php

//======================================
//  插入共同选项配置表
// 参数: data        选项配置数组
// 返回: row          插入id
//======================================
function ins_ba_com_option_config($data) {
    $db = new DB_COM();
    $sql = $db->sqlInsert("com_option_config", $data);
    $row = $db->query($sql);
    return $row;
}
//======================================
//  查询共同选项配置表（ba）
// 参数:
// 返回: rows          配置表信息数组
//       option_name        选项名称
//       option_key         选项关键字
//       option_value       选项值
//       opyion_sort        选项排序
//       sub_id             模块id
//       status             有效标志
//       option_src
//======================================
function sel_ba_com_option_config()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM com_option_config WHERE option_name = 'bit_type' and sub_id = 'BA' and status = 1";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
//======================================
//  查询共同选项配置表通过选项关键字(ba)
// 参数:
// 返回: rows          配置表信息数组
//       option_name        选项名称
//       option_key         选项关键字
//       option_value       选项值
//       opyion_sort        选项排序
//       sub_id             模块id
//       status             有效标志
//       option_src
//======================================
function sel_ba_com_option_config_by_option_key($option_key)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM com_option_config WHERE option_name = 'bit_type' and sub_id = 'BA' and option_key = '{$option_key}' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
//  更新共同选项配置表通过选项关键字(ba)
// 参数:
// 返回: rows          配置表信息数组
//       option_name        选项名称
//       option_key         选项关键字
//       option_value       选项值
//       opyion_sort        选项排序
//       sub_id             模块id
//       status             有效标志
//       option_src
//======================================
function upd_ba_com_option_config_valid($option_key){
    $db = new DB_COM();
    $sql = "UPDATE com_option_config SET status = 1 WHERE option_key = '{$option_key}' and sub_id = 'BA' and option_name = 'bit_type'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}
//======================================
//  更新共同选项配置表通过选项关键字(ba)
// 参数:
// 返回: rows          配置表信息数组
//       option_name        选项名称
//       option_key         选项关键字
//       option_value       选项值
//       opyion_sort        选项排序
//       sub_id             模块id
//       status             有效标志
//       option_src
//======================================
function upd_ba_com_option_config($option_key){
    $db = new DB_COM();
    $sql = "UPDATE com_option_config SET status = 9 WHERE option_key = '{$option_key}' and sub_id = 'BA' and option_name = 'bit_type'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}
//======================================
//  插入共同选项配置表(ca)
// 参数:
// 返回: rows          配置表信息数组
//       option_name        选项名称
//       option_key         选项关键字
//       option_value       选项值
//       opyion_sort        选项排序
//       sub_id             模块id
//       status             有效标志
//       option_src
//======================================
function ins_ca_com_option_config($data) {
    $db = new DB_COM();
    $sql = $db->sqlInsert("com_option_config", $data);
    $row = $db->query($sql);
    return $row;
}

//======================================
//  查询共同选项配置表(ca)
// 参数:
// 返回: rows          配置表信息数组
//       option_name        选项名称
//       option_key         选项关键字
//       option_value       选项值
//       opyion_sort        选项排序
//       sub_id             模块id
//       status             有效标志
//       option_src
//======================================
function sel_ca_com_option_config()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM com_option_config WHERE option_name = 'ca_channel' and sub_id = 'CA' and status = 1";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
//======================================
//  查询共同选项配置表通过选项关键字(ca)
// 参数:
// 返回: rows          配置表信息数组
//       option_name        选项名称
//       option_key         选项关键字
//       option_value       选项值
//       opyion_sort        选项排序
//       sub_id             模块id
//       status             有效标志
//       option_src
//======================================
function sel_ca_com_option_config_by_option_key($option_key)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM com_option_config WHERE option_name = 'ca_channel' and sub_id = 'CA' and option_key = '{$option_key}' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
//  更新共同选项配置表通过选项关键字(ca)
// 参数:option_key     选项关键字
// 返回: rows          配置表信息数组
//       option_name        选项名称
//       option_key         选项关键字
//       option_value       选项值
//       opyion_sort        选项排序
//       sub_id             模块id
//       status             有效标志
//       option_src
//======================================
function upd_ca_com_option_config($option_key){
    $db = new DB_COM();
    $sql = "UPDATE com_option_config SET status = 9 WHERE option_key = '{$option_key}' and sub_id = 'CA' and option_name = 'ca_channel'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}
//======================================
//  更新共同选项配置表通过选项关键字(ca)
// 参数:option_key      选项关键字
// 返回: rows          配置表信息数组
//       option_name        选项名称
//       option_key         选项关键字
//       option_value       选项值
//       opyion_sort        选项排序
//       sub_id             模块id
//       status             有效标志
//       option_src
//======================================
function upd_ca_com_option_config_valid($option_key){
    $db = new DB_COM();
    $sql = "UPDATE com_option_config SET status = 1 WHERE option_key = '{$option_key}' and sub_id = 'CA' and option_name = 'ca_channel'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}
function set_configure_key($data){
    $db = new DB_COM();
    $sql = $db->sqlInsert("com_option_config", $data);
    $row = $db->query($sql);
    return $row;
}
function upd_configure_key($data){
    $db = new DB_COM();
    $sql = $db->sqlUpdate("com_option_config",$data,"option_name = 'api_key'");
    $db->query($sql);
    $count = $db ->affectedRows();
    return $count;
}

function get_configure_key()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM com_option_config WHERE option_name = 'api_key' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}
