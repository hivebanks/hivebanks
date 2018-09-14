<?php

//======================================
// 函数: 获取ba用户基本信息
// 参数: ca_id            用户ca_id
// 返回: row             用户基本信息数组
//         ca_id            用户id
//         base_amount      用户可用余额
//         lock_amount      用户锁定余额
//         security_level   用户安全等级
//         ca_type          代理商类型
//         ca_level         安全等级
//======================================
function get_ca_base_info($ca_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ca_base WHERE ca_id = '{$ca_id}' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 函数: 更新ba用户base_amount
// 参数: ca_id            用户ca_id
//      base_amount      订单base_amount
// 返回: true           更新成功
// 返回: false          更新失败
//======================================
function upd_ca_base_amount_info($ca_id,$base_amount) {
    $db = new DB_COM();
    $sql = "UPDATE ca_base SET base_amount = '{$base_amount}' WHERE ca_id = '{$ca_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}

//======================================
// 函数: 插入ca_base ba用户基本信息
// 参数: data_base              用户基本信息数组
//         base_amount         用户id
//         lock_amount         用户可用余额
//         ca_level            用户锁定余额
//         security_level      用户安全等级
//         ca_id               用户ca_id
//         ca_type             代理商类型
//         utime               用户更新时间
//         ctime               用户创建时间
// 返回: true           插入成功
// 返回: false          插入失败
//======================================
function ins_base_ca_reg_base_info($data_base)
{
    $data_base['base_amount'] = 0;
    $data_base['lock_amount'] =0;
    $data_base['ca_level'] = 0;
    $data_base['security_level'] = 2;
    $data_base['utime'] = time();
    $data_base['ctime'] = date("Y-m-d H:i:s");
    $db = new DB_COM();
    $sql = $db ->sqlInsert("ca_base", $data_base);
    $q_id = $db->query($sql);
    return $q_id;
}

//======================================
// 函数: 拒绝充值订单，更新用户base_amount,lock_amount
// 参数: ca_id            用户ca_id
//      base_amount       充值订单基准货币金额
//      lock_amount        充值订单基准货币锁定金额
// 返回: true           更新成功
// 返回: false          更新失败
//======================================
function upd_refuse_ca_base_amount_info($ca_id,$base_amount,$lock_amount) {
    $db = new DB_COM();
    $sql = "SELECT base_amount,lock_amount FROM ca_base WHERE ca_id = '{$ca_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    $new_base_amount = $rows["base_amount"] + $base_amount;
    $new_lock_amount = $rows["lock_amount"] - $lock_amount;
    $sql = "UPDATE ca_base SET base_amount = '{$new_base_amount}', lock_amount = '{$new_lock_amount}' WHERE ca_id = '{$ca_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}

//======================================
// 函数: 接受充值订单，更新用户lock_amount
// 参数: ca_id            用户ca_id
//      lock_amount        充值订单基准货币锁定金额
// 返回: true           更新成功
// 返回: false          更新失败
//======================================
function upd_ca_lock_amount_info($ca_id,$lock_amount) {
    $db = new DB_COM();
    $sql = "SELECT lock_amount FROM ca_base WHERE ca_id = '{$ca_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    //目前lock_amount-该订单的lock_amount
    $new_lock_amount = $rows["lock_amount"] - $lock_amount;
    $sql = "UPDATE ca_base SET lock_amount = '{$new_lock_amount}' WHERE ca_id = '{$ca_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}

//======================================
// 函数: 更新ba用户security_level
// 参数: ca_id            用户ca_id
//      savf_level        安全等级
// 返回: true           更新成功
// 返回: false          更新失败
//======================================
function  upd_savf_level($ca_id,$savf_level)
{
    $db = new DB_COM();
    $sql = "UPDATE ca_base SET security_level = '{$savf_level}' WHERE ca_id = '{$ca_id}'";
    $id = $db -> query($sql);
    return $id;
}
//======================================
// 函数: 更新ca用户的昵称
// 参数: ca_id            用户ca_id
//      ca_account       用户的昵称
// 返回: id          成功id
//======================================
function  upd_ca_accout($ca_id,$ca_account)
{
    $db = new DB_COM();
    $sql = "UPDATE ca_base SET ca_account = '{$ca_account}' WHERE ca_id = '{$ca_id}'";
    $id = $db -> query($sql);
    return $id;
}
