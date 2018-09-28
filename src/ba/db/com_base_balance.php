<?php

//======================================
// 函数: 获取com_base_balance基本信息
// 参数: ba_id                  用户ba_id
// 返回: row                    用户基本信息数组
//         tx_type              交易类型
//         tx_amount            交易金额
//         credit_balance       借方交易后余额
//         hash_id              HASH值
//         ctime                变动时间
//======================================
function get_log_balance($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT tx_type,tx_amount,credit_balance,hash_id,ctime FROM com_base_balance WHERE credit_id = '{$ba_id}'";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
//======================================
// 函数: 插入用户com_base_balance变动基本信息
// 参数: data_base               基本信息数组
//         hash_id               HASH值
//         tx_id                 交易ID（借贷双方同）
//         credit_id             借方ID
//         debit_id              贷方ID
//         tx_type               交易类型
//         tx_amount             交易金额
//         credit_balance        借方交易后余额
//         utime                 变动时间戳
//         ctime                 变动时间
// 返回: true           插入成功
// 返回: false          插入失败
//======================================
function ins_us_rechargeAndwithdraw_com_base_banlance($data) {
    $db = new DB_COM();
    $sql = $db->sqlInsert("com_base_balance", $data);
    $row = $db->query($sql);
    return $row;
}

//======================================
// 函数: 插入bacom_base_balance变动基本信息
// 参数: data_base               基本信息数组
//         hash_id               HASH值
//         tx_id                 交易ID（借贷双方同）
//         credit_id             借方ID
//         debit_id              贷方ID
//         tx_type               交易类型
//         tx_amount             交易金额
//         credit_balance        借方交易后余额
//         utime                 变动时间戳
//         ctime                 变动时间
// 返回: true           插入成功
// 返回: false          插入失败
//======================================
function ins_ba_rechargeAndwithdraw_com_base_banlance($data) {
    $db = new DB_COM();
    $sql = $db->sqlInsert("com_base_balance", $data);
    $row = $db->query($sql);
    return $row;
}
//======================================
// 函数: 获取充值的前置hash
// 参数: ba_id                 baID
// 返回: hash_id               前置hashid
//======================================
function  get_recharge_pre_hash($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}' and tx_type = 'ba_in' ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}
//======================================
// 函数: 获取提现的前置hash
// 参数: ba_id                 baID
// 返回: hash_id               前置hashid
//======================================
function  get_withdraw_pre_hash($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}' and tx_type = 'ba_out' ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}
//======================================
// 函数: 获取ca充值的前置hash
// 参数: ca_id                 caID
// 返回: hash_id               前置hashid
//======================================
function  get_ca_recharge_pre_hash($ca_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ca_id}' and tx_type = 'ca_in' ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}
//======================================
// 函数: 获取ca提现的前置hash
// 参数: ca_id                 caID
// 返回: hash_id               前置hashid
//======================================
function  get_ca_withdraw_pre_hash($ca_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ca_id}' and tx_type = 'ca_out' ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}
