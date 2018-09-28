<?php

//======================================
// 函数: 数字货币充值记录总数查询
// 参数: us_id         用户id
//      type          查询类型
// 返回: count         记录总数
//======================================
function get_us_ba_recharge_total_by_us_id($us_id,$type)
{
    $db = new DB_COM();
    $sql = "select * from us_ba_recharge_request where us_id='{$us_id}'  AND qa_flag = '{$type}'";
    $db->query($sql);
    return $count = $db->affectedRows();
}
//======================================
// 函数: 数字货币充值记录总数查询
// 参数: us_id         用户id
//      offset        查询起始位置
//      limit         查询个数
//      type          查询类型
// 返回: rows          查询数组
//======================================
function get_us_ba_recharge_rows($us_id,$offset,$limit,$type)
{
    $db = new DB_COM();
    $sql = "select * from us_ba_recharge_request where us_id='{$us_id}'  and qa_flag = '{$type}'  limit $offset,$limit";
    $db->query($sql);
    return $res = $db->fetchAll();
}
