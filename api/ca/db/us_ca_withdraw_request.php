<?php
//======================================
// 函数: 更新us_ca_withdraw_request订单qa_flag
// 参数: ca_id          用户ca_id
//      qa_flag        订单状态
//      qa_id          请求ID
// 返回: true           更新成功
// 返回: false          更新失败
//======================================
function upd_withdraw_ca_base_amount_info($ca_id,$qa_flag,$qa_id) {
    $db = new DB_COM();
    $sql = "UPDATE us_ca_withdraw_request SET qa_flag = '{$qa_flag}' WHERE ca_id = '{$ca_id}' and qa_id = '{$qa_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}
//======================================
// 函数: 根据订单号，获取us_ca_withdraw_request基本信息
// 参数: qa_id                      订单号
// 返回: row                        基本信息数组
//         asset_id                 充值资产ID
//         bit_amount               数字货币金额
//         base_amount              充值资产金额
//         tx_time                  请求时间戳
//         tx_hash                  交易HASH
//         us_id                    用户ID
//         qa_id                    请求ID
//         ca_id                    代理商ID
//         tx_detail                交易明细（JSON）
//         ca_account_id            代理商账号ID（Hash）
//======================================
function sel_withdraw_ca_base_amount_info($qa_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_ca_withdraw_request WHERE qa_id = '{$qa_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}

//======================================
// 函数: 根据状态，获取us_ca_withdraw_request基本信息
// 参数: ca_id                      用户ca_id
//      qa_flag                    订单状态
// 返回: row                        基本信息数组
//         asset_id                 充值资产ID
//         bit_amount               数字货币金额
//         base_amount              充值资产金额
//         tx_time                  请求时间戳
//         tx_hash                  交易HASH
//         us_id                    用户ID
//         qa_id                    请求ID
//         ca_id                    代理商ID
//         tx_detail                交易明细（JSON）
//         ca_account_id            代理商账号ID（Hash）
//======================================
function  get_ca_withdraw_request_ca_id($ca_id,$qa_flag)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_ca_withdraw_request WHERE ca_id = '{$ca_id}' and qa_flag = '{$qa_flag}'";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
//======================================
// 函数: 插入us_ca_withdraw_request基本信息
// 参数: data_base                  基本信息数组
//         asset_id                 充值资产ID
//         bit_amount               数字货币金额
//         base_amount              充值资产金额
//         tx_time                  请求时间戳
//         tx_hash                  交易HASH
//         us_id                    用户ID
//         qa_id                    请求ID
//         ca_id                    代理商ID
//         tx_detail                交易明细（JSON）
//         ca_account_id            代理商账号ID（Hash）
// 返回: true           插入成功
// 返回: false          插入失败
//======================================
function ins_withdraw_ca_base_amount_info($data_base)
{
    $db = new DB_COM();
    $sql = $db ->sqlInsert("us_ca_withdraw_request", $data_base);
    return $db->query($sql);
}
//======================================
// 函数: 获取us_ca_withdraw_request未处理订单数量
// 参数: ca_id                      ba用户id
// 返回: count                     数量
//======================================
function  get_ca_withdraw_amount_request_ca_id($ca_id)
{
    $db = new DB_COM();
    $sql = "SELECT count(*) FROM us_ca_withdraw_request WHERE ca_id = '{$ca_id}' and qa_flag = 0";
    $db -> query($sql);
    $count = $db -> fetchRow();
    return $count;
}
