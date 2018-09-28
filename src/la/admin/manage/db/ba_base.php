<?php

//======================================
//  获取ba的列表
// 参数:
// 返回: rows          ba信息数组
//       ba_id        baID
//       ba_nm         代理商编号（内部唯一）
//       ba_account    代理商表示账号（内部唯一）
//       base_amount   基准资产余额
//       lock_amount   锁定余额
//       ba_type       代理商类型
//       ba_level      代理商等级
//       security_level安全等级
//       utime         更新时间
//       ctime         创建时间
//======================================
function get_ba_base_info()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_base";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
//======================================
//  获取ba的基本信息通过ba_id
// 参数: ba_id         ba的id
// 返回: rows          ba信息数组
//       ba_id        baID
//       ba_nm         代理商编号（内部唯一）
//       ba_account    代理商表示账号（内部唯一）
//       base_amount   基准资产余额
//       lock_amount   锁定余额
//       ba_type       代理商类型
//       ba_level      代理商等级
//       security_level安全等级
//       utime         更新时间
//       ctime         创建时间
//======================================
function get_ba_base_info_by_ba_id($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_base where ba_id = '{$ba_id}'";
    $db->query($sql);
    $rows = $db->fetchrow();
    return $rows;
}
//======================================
//  更新ba保证金金额
// 参数:  ba_id        ba_id
//        base_amount 保证金金额
// 返回:             影响行数
//======================================
function update_ba_bail($ba_id,$base_amount)
{
    $t = time();
    $db = new DB_COM();
    $sql = "update ba_base set base_amount = '{$base_amount}' , utime = '{$t}' where ba_id='{$ba_id}' ";
    $db->query($sql);
    return $db->affectedRows();
}
//======================================
//  检测是否为基准ba
// 参数:  ba_id        ba_id
// 返回:  是否为基准ba，若是则不能修改
//======================================
function is_base_ba_check($ba_id)
{
    $db = new DB_COM();
    $sql = "select ba_type from ba_base where ba_id = '{$ba_id}'";
    $db->query($sql);
    $res = $db->fetchRow();
    $sql = "select base_currency from la_base limit 1";
    $db->query($sql);
    $res_la = $db->fetchRow();
    if($res['ba_type'] != $res_la['base_currency'])
        exit_error('307','此ba为非基准ba，保证金不允许被修改');
}