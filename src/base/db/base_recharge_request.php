<?php

//======================================
// 函数: 获取数字货币充值保证金请求
// 参数: qa_id               请求id
//      ba_id               数字货币代理
// 返回: rows                信息数组
//======================================
function  get_ba_recharge_request_ba_id($ba_id,$qa_flag)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM base_recharge_request WHERE base_id = '{$ba_id}' and qa_flag = '{$qa_flag}'";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
//======================================
// 函数: 搜寻充值ba保证金信息
// 参数: qa_id               请求id
// 返回: rows                信息数组
//======================================
function sel_recharge_ba_base_amount_info($qa_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM base_recharge_request WHERE qa_id = '{$qa_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}

