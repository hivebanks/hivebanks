<?php

//======================================
//  获取ba的列表
// 参数:
// 返回: rows          ba信息数组
//        ba_id        baID
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
////======================================
////  查询ba
//// 参数: ba_id         ba的id
//// 返回:
////       count        影响的行数
////======================================
//function get_ba_by_ba_id($ba_id){
//    $db = new DB_COM();
//    $sql = "select * from ba_base where ba_id='{$ba_id}' ";
//    $db->query($sql);
//    return $count = $db->affectedRows();
//}
