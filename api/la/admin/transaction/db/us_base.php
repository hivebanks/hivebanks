<?php

//======================================
//  获取用户的列表
// 参数:
// 返回: rows          ba信息数组
//        us_id        baID
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
////======================================
////  查询us
//// 参数: us_id         us的id
//// 返回:
////       count        影响的行数
////======================================
//function get_us_by_us_id($us_id){
//    $db = new DB_COM();
//    $sql = "select * from us_base where us_id='{$us_id}' ";
//    $db->query($sql);
//    return $count = $db->affectedRows();
//}