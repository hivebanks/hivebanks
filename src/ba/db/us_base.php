<?php

//======================================
// 函数: 更新用户base_amount,lock_amount
// 参数: us_id            用户id
//      base_amount       订单基准货币金额
//      lock_amount       订单基准货币锁定金额
// 返回: true           更新成功
// 返回: false          更新失败
//======================================
function upd_us_base_amount_info($us_id,$base_amount,$lock_amount) {
    $db = new DB_COM();
    $sql = "SELECT base_amount,lock_amount FROM us_base WHERE us_id = '{$us_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    $new_base_amount = $rows["base_amount"] - $base_amount;
    $new_lock_amount = $rows["lock_amount"] + $lock_amount;
    $sql = "UPDATE us_base SET base_amount = '{$new_base_amount}', lock_amount = '{$new_lock_amount}' WHERE us_id = '{$us_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}

//======================================
// 函数: 拒绝提现订单，更新用户base_amount,lock_amount
// 参数: ba_id             用户ba_id
//      base_amount       充值订单基准货币金额
//      lock_amount       充值订单基准货币锁定金额
// 返回: true           更新成功
// 返回: false          更新失败
//======================================
function upd_refuse_us_base_amount_info($us_id,$base_amount,$lock_amount) {
    $db = new DB_COM();
    $sql = "SELECT base_amount,lock_amount FROM us_base WHERE us_id = '{$us_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    $new_base_amount = $rows["base_amount"] + $base_amount;
    $new_lock_amount = $rows["lock_amount"] - $lock_amount;
    $sql = "UPDATE us_base SET base_amount = '{$new_base_amount}', lock_amount = '{$new_lock_amount}' WHERE us_id = '{$us_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);

    return $count;
}
//======================================
// 函数: 获取ba用户基本信息
// 参数: us_id            用户$us_id
// 返回: base_amount      用户可用余额
//======================================
function get_us_base_info($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_base WHERE us_id = '{$us_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}
//======================================
// 函数: 接受提现订单，更新用户lock_amount
// 参数: us_id               用户id
//      lock_amount        提现订单基准货币锁定金额
// 返回: true           更新成功
// 返回: false          更新失败
//======================================
function upd_us_lock_amount_info($us_id,$lock_amount) {
    $db = new DB_COM();
    $sql = "SELECT * FROM us_base WHERE us_id = '{$us_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    $new_lock_amount = $rows["lock_amount"] - $lock_amount;
    if ($new_lock_amount < 0)
        exit_error("订单异常，金额不对,联系管理员");
    $sql = "UPDATE us_base SET lock_amount = '{$new_lock_amount}' WHERE us_id = '{$us_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);

    return $count;
}

//======================================
// 函数: 接受充值订单，更新用户$base_amount
// 参数: us_id             用户id
//      base_amount       基准货币余额
// 返回: true           更新成功
// 返回: false          更新失败
//======================================
function upd_us_recharge_base_amount_info($us_id,$base_amount) {
    $db = new DB_COM();
    $sql = "UPDATE us_base SET base_amount = '{$base_amount}' WHERE us_id = '{$us_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}
