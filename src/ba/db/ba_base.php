<?php

//======================================
// 函数: 获取ba用户基本信息
// 参数: ba_id            用户ba_id
// 返回: row              用户基本信息数组
//         ba_id            用户id
//         base_amount      用户可用余额
//         lock_amount      用户锁定余额
//         security_level   用户安全等级
//         ba_type          代理商类型
//         ba_level         安全等级
//======================================
function get_ba_base_info($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_base WHERE ba_id = '{$ba_id}' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 函数: 获取ba用户ba_id
// 参数: bit_type            代理商类型
// 返回: ba_id               用户ba_id
//======================================
function  us_get_ba_settting_rate_ba_id($bit_type)
{
    $db = new DB_COM();
    $sql = "SELECT ba_id FROM ba_base where ba_type = '{$bit_type}' order by base_amount desc limit 1";
    $db -> query($sql);
    $ba_id = $db -> getField($sql,'ba_id');
    return $ba_id;
}
//======================================
// 函数: 更新ba用户base_amount
// 参数: ba_id             用户ba_id
//      base_amount       订单base_amount
// 返回: true              更新成功
// 返回: false              更新失败
//======================================
function upd_ba_base_amount_info($ba_id,$base_amount) {
    $db = new DB_COM();
    $sql = "UPDATE ba_base SET base_amount = '{$base_amount}' WHERE ba_id = '{$ba_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}

//======================================
// 函数: 插入ba_base ba用户基本信息
// 参数: data_base             用户基本信息数组
//        base_amount         用户i
//        lock_amount         用户可用余额
//        ba_level            用户锁定余额
//        security_level      用户安全等级
//        ba_id               用户ba_id
//        ba_type             代理商类型
//        utime               用户更新时间
//        ctime               用户创建时间
// 返回: true           插入成功
// 返回: false          插入失败
//======================================
function ins_base_ba_reg_base_info($data_base)
{
    $data_base['base_amount'] = 0;
    $data_base['lock_amount'] =0;
    $data_base['ba_level'] = 0;
    $data_base['security_level'] = 2;
    $data_base['utime'] = time();
    $data_base['ctime'] = date("Y-m-d H:i:s");
    $db = new DB_COM();
    $sql = $db ->sqlInsert("ba_base", $data_base);
    $q_id = $db->query($sql);
    if ($q_id == 0)
        return false;
    return true;
}

//======================================
// 函数: 拒绝充值订单，更新用户base_amount,lock_amount
// 参数: ba_id            用户ba_id
//      base_amount       充值订单基准货币金额
//      lock_amount       充值订单基准货币锁定金额
// 返回: true              更新成功
// 返回: false             更新失败
//======================================
function upd_refuse_ba_base_amount_info($ba_id,$base_amount,$lock_amount) {
    $db = new DB_COM();
    $sql = "SELECT base_amount,lock_amount FROM ba_base WHERE ba_id = '{$ba_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    $new_base_amount = $rows["base_amount"] + $base_amount;
    $new_lock_amount = $rows["lock_amount"] - $lock_amount;
    $sql = "UPDATE ba_base SET base_amount = '{$new_base_amount}', lock_amount = '{$new_lock_amount}' WHERE ba_id = '{$ba_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}

//======================================
// 函数: 接受充值订单，更新用户lock_amount
// 参数: ba_id              用户ba_id
//      lock_amount        充值订单基准货币锁定金额
// 返回: true               更新成功
// 返回: false              更新失败
//======================================
function upd_ba_lock_amount_info($ba_id,$lock_amount) {
    $db = new DB_COM();
    $sql = "SELECT lock_amount FROM ba_base WHERE ba_id = '{$ba_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    //目前lock_amount-该订单的lock_amount
    $new_lock_amount = $rows["lock_amount"] - $lock_amount;
    $sql = "UPDATE ba_base SET lock_amount = '{$new_lock_amount}' WHERE ba_id = '{$ba_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);

    return $count;
}
//======================================
// 函数: 更新ba用户security_level
// 参数: ba_id            用户ba_id
//      savf_level        安全等级
// 返回: true           更新成功
// 返回: false          更新失败
//======================================
function  upd_savf_level($ba_id,$savf_level)
{
    $db = new DB_COM();
    $sql = "UPDATE ba_base SET security_level = '{$savf_level}' WHERE ba_id = '{$ba_id}'";
    $id = $db -> query($sql);
    return $id;
}
//======================================
// 函数: 更新ba用户的昵称
// 参数: ba_id            用户ba_id
//      ba_account       用户的昵称
// 返回: id                成功id
//======================================
function  upd_ba_accout($ba_id,$ba_account)
{
    $db = new DB_COM();
    $sql = "UPDATE ba_base SET ba_account = '{$ba_account}' WHERE ba_id = '{$ba_id}'";
    $id = $db -> query($sql);
    return $id;
}
//======================================
// 函数: 获取基准ba用户列表的昵称
// 参数: bit_type          基准货币类型
// 返回: row               ba用户列表
//======================================
function get_base_ba_list($bit_type)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_base WHERE ba_type = '{$bit_type}' and base_amount > 0 limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 函数: 获取ba用户设定的汇率的昵称
// 参数: bit_type          基准货币类型
// 返回: row               ba用户列表
//======================================
function  ba_get_base_ba_settting_rate_ba_id($bit_type)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_base where ba_type = '{$bit_type}' order by base_amount desc limit 1";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}
