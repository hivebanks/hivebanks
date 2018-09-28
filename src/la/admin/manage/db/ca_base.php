<?php

//======================================
//  获取ca的列表
// 参数:
// 返回: rows          ca信息数组
//       ca_id         caID
//       ca_nm         代理商编号（内部唯一）
//       ca_account    代理商表示账号（内部唯一）
//       base_amount   基准资产余额
//       lock_amount   锁定余额
//       ca_type       代理商类型
//       ca_level      代理商等级
//       security_level安全等级
//       utime         更新时间
//       ctime         创建时间
//======================================
function get_ca_base_info()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ca_base";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
//======================================
//  获取ca的基本信息
// 参数: ca_id         caID
// 返回: rows          ca信息数组
//       ca_id         caID
//       ca_nm         代理商编号（内部唯一）
//       ca_account    代理商表示账号（内部唯一）
//       base_amount   基准资产余额
//       lock_amount   锁定余额
//       ca_type       代理商类型
//       ca_level      代理商等级
//       security_level安全等级
//       utime         更新时间
//       ctime         创建时间
//======================================
function get_ca_base_info_by_ca_id($ca_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ca_base where ca_id = '{$ca_id}'";
    $db->query($sql);
    $rows = $db->fetchrow();
    return $rows;
}
//======================================
//  更新ca保证金金额
// 参数:  ca_id        ca_id
//        base_amount 保证金金额
// 返回:             影响行数
//======================================
function update_ca_bail($ca_id,$base_amount)
{
    $t = time();
    $db = new DB_COM();
    $sql = "update ca_base set base_amount = '{$base_amount}' , utime = '{$t}' where ca_id='{$ca_id}' ";
    $db->query($sql);
    return $db->affectedRows();

}

