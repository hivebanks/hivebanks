<?php

//======================================
//  获取用户的列表
// 参数:
// 返回: rows          用户信息数组
//        us_id        用户ID
//        us_nm         用户编号（内部唯一）
//        us_account    用户表示账号（内部唯一）
//        base_amount   基准资产余额
//        lock_amount   锁定余额
//        us_type       用户类型
//        us_level      用户等级
//        security_level安全等级
//        utime         更新时间
//        ctime         创建时间
//======================================
function get_us_base_info()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_base";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
//======================================
//  获取用户的基本信息通过us_id
// 参数: us_id         用户id
// 返回: rows          用户信息数组
//        us_id        用户ID
//        us_nm         用户编号（内部唯一）
//        us_account    用户表示账号（内部唯一）
//        base_amount   基准资产余额
//        lock_amount   锁定余额
//        us_type       用户类型
//        us_level      用户等级
//        security_level安全等级
//        utime         更新时间
//        ctime         创建时间
//======================================
function get_us_base_info_by_us_id($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_base where us_id = '{$us_id}'";
    $db->query($sql);
    $rows = $db->fetchrow();
    return $rows;
}
