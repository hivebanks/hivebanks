<?php

//======================================
// 函数: 获取ba_rate_setting充值基本信息
// 参数: ba_id                  用户ba_id
// 返回: row                    ba_rate_setting基本信息数组
//         us_level            用户等级要求
//         base_rate           基本汇率
//         min_amount          最小额度
//         max_amount          最大额度
//         bit_type            代理数字货币类型
//         tx_fee              交易手续费率
//         set_time            设定时间戳
//======================================
function  get_ba_settting_recharge_rate_ba_id($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_rate_setting WHERE ba_id = '{$ba_id}' and rate_type = '1' limit 1";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}

//======================================
// 函数: 获取ba_rate_setting提现基本信息
// 参数: ba_id                  用户ba_id
// 返回: row                    ba_rate_setting基本信息数组
//         us_level            用户等级要求
//         base_rate           基本汇率
//         min_amount          最小额度
//         max_amount          最大额度
//         bit_type            代理数字货币类型
//         tx_fee              交易手续费率
//         set_time            设定时间戳
//======================================
function  get_ba_settting_withdraw_rate_ba_id($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_rate_setting WHERE ba_id = '{$ba_id}' and rate_type = '2' limit 1";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}

//======================================
// 函数: 获取有效的提现不重复的ba列表
// 参数: time                  当前时间戳
// 返回: new_rows              所有base_rate数组
//======================================
function  get_ba_withdraw_settting_rate_list_ba_id($time)
{
    $db = new DB_COM();
    $sql = "SELECT bit_type,min(base_rate) FROM ba_rate_setting where rate_type = '2' and limit_time > '{$time}' group by bit_type ";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}

//======================================
// 函数: 获取有效的充值不重复的ba列表
// 参数: time                  当前时间戳
// 返回: new_rows              所有base_rate数组
//======================================
function  get_ba_recharge_setting_rate_list_ba_id($time)
{
    $db = new DB_COM();
    $sql = "SELECT bit_type,max(base_rate) FROM ba_rate_setting where rate_type = '1' and limit_time > '{$time}' group by bit_type ";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}

//=====================================
// 函数: 插入ba_rate_setting充值基本信息
// 参数: data_base              用户基本信息数组
//         ba_id               用户id
//         bit_type            代理数字货币类型
//         rate_type            汇率类型
//         base_rate            基本汇率
//         us_level             用户等级要求
//         min_amount           最小额度
//         max_amount           最大额度
//         limit_time
//         set_time             设定时间戳
// 返回: true           插入成功
// 返回: false          插入失败
//======================================
function ins_ba_recharge_rate_info($data_base)
{
    $db = new DB_COM();
    $sql = "SELECT set_id FROM ba_rate_setting WHERE rate_type = '1' and ba_id = '{$data_base["ba_id"]}' and bit_type = '{$data_base["bit_type"]}'";
    $db -> query($sql);
    $row = $db ->fetchRow();
    if (!$row["set_id"]) {
        $sql = $db ->sqlInsert("ba_rate_setting", $data_base);
        $q_id = $db->query($sql);
        return $q_id;
    }else {
        $sql = $db->sqlUpdate("ba_rate_setting", $data_base,"set_id = '{$row["set_id"]}' and rate_type = '1'");
        $db -> query($sql);
        $count = $db ->affectedRows();
        return $count;
    }

}

//======================================
// 函数: 插入ba_rate_setting提现基本信息
// 参数: data_base              用户基本信息数组
//         ba_id               用户id
//         bit_type            代理数字货币类型
//         rate_type            汇率类型
//         base_rate            基本汇率
//         us_level             用户等级要求
//         min_amount           最小额度
//         max_amount           最大额度
//         limit_time
//         set_time             设定时间戳
// 返回: true           插入成功
// 返回: false          插入失败
//======================================
function ins_ba_withdraw_rate_info($data_base)
{
    $db = new DB_COM();
    $sql = "SELECT set_id FROM ba_rate_setting WHERE rate_type = '2' and ba_id = '{$data_base["ba_id"]}' and bit_type = '{$data_base["bit_type"]}'";
    $db -> query($sql);
    $row = $db ->fetchRow();
    if (!$row["set_id"]) {
        $sql = $db ->sqlInsert("ba_rate_setting", $data_base);
        $q_id = $db->query($sql);
        if ($q_id == 0)
            return false;
        return true;
    }else {
        $sql = $db->sqlUpdate("ba_rate_setting", $data_base,"set_id = '{$row["set_id"]}' and rate_type = '2'");
        $db -> query($sql);
        $count = $db ->affectedRows();
        return $count;
    }

}
