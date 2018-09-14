<?php

//======================================
// 函数: 数字货币充值记录总数查询
// 参数: us_id         用户id
//      type          查询类型
// 返回: count         记录总数
//======================================
function get_us_ba_withdraw_total_by_us_id($us_id,$type)
{
    $db = new DB_COM();
    $sql = "select * from us_ba_withdraw_request  where us_id='{$us_id}'  and qa_flag= '{$type}'";
    $db->query($sql);
    return $count = $db->affectedRows();
}
//======================================
// 函数: 数字货币提现记录总数查询
// 参数: us_id         用户id
//      offset        查询起始位置
//       limit        查询个数
//       type         查询类型
// 返回: rows          查询数组
//======================================
function get_us_ba_withdraw_rows($us_id,$offset,$limit,$type)
{
    $db = new DB_COM();
    $sql = "select * from us_ba_withdraw_request where us_id='{$us_id}' and qa_flag= '{$type}' limit $offset,$limit";
    $db->query($sql);
    return $res = $db->fetchAll();
}
//======================================
// 函数: 获取用户提现订单
// 参数: us_id        用户id
// 返回: rows         订单信息数组
//======================================
function get_us_withdraw_order_list($us_id)
{
    $db = new DB_COM();
    $sql = "select * from us_ba_withdraw_request where us_id='{$us_id}' ORDER BY qa_id DESC LIMIT 1";
    $db->query($sql);
    return $res = $db->fetchAll();
}
