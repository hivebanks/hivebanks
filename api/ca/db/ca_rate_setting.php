<?php

//======================================
// 函数: 分配ca
// 参数: bit_type            代理商类型
// 返回: ca_id               用户ca_id
//======================================
function  us_get_ca_recharge_settting_rate_ca_id($ca_channel)
{
    $db = new DB_COM();
    $sql = "SELECT ca_id FROM ca_rate_setting where ca_channel = '{$ca_channel}' and rate_type = 1 order by base_rate desc limit 1";
    $db -> query($sql);
    $ca_id = $db -> getField($sql,'ca_id');
    return $ca_id;
}
//======================================
// 函数: 分配提现ba
// 参数: bit_type            代理商类型
// 返回: ca_id               用户ca_id
//======================================
function  us_get_ca_withdraw_settting_rate_ca_id($ca_channel)
{
    $db = new DB_COM();
    $sql = "SELECT ca_id FROM ca_rate_setting where ca_channel = '{$ca_channel}' and rate_type = 2 order by base_rate desc limit 1";
    $db -> query($sql);
    $ca_id = $db -> getField($sql,'ca_id');
    return $ca_id;
}
//======================================
// 函数: 获取ca_rate_setting充值基本信息
// 参数: ca_id                  用户ca_id
// 返回: row                    ca_rate_setting基本信息数组
//         us_level            用户等级要求
//         base_rate           基本汇率
//         min_amount          最小额度
//         max_amount          最大额度
//         bit_type            代理数字货币类型
//         tx_fee              交易手续费率
//         set_time            设定时间戳
//======================================
function  get_ca_settting_recharge_rate_ca_id($ca_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ca_rate_setting WHERE rate_type = '1' and ca_id = '{$ca_id}' limit 1";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}
//======================================
// 函数: 获取ca_rate_setting提现基本信息
// 参数: ca_id                  用户ca_id
// 返回: row                    ca_rate_setting基本信息数组
//         us_level            用户等级要求
//         base_rate           基本汇率
//         min_amount          最小额度
//         max_amount          最大额度
//         bit_type            代理数字货币类型
//         tx_fee              交易手续费率
//         set_time            设定时间戳
//======================================
function  get_ca_settting_withdraw_rate_ca_id($ca_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ca_rate_setting WHERE  rate_type = '2' and ca_id = '{$ca_id}' limit 1";
    $db -> query($sql);
    $row = $db -> fetchRow();
    return $row;
}
//======================================
// 函数: 插入ca_rate_setting充值基本信息
// 参数: data_base              用户基本信息数组
//         ca_id               用户id
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
function ins_ca_recharge_rate_info($data_base)
{
    $db = new DB_COM();
    $sql = "SELECT set_id FROM ca_rate_setting WHERE rate_type = '1' and ca_id = '{$data_base["ca_id"]}' and ca_channel = '{$data_base["ca_channel"]}'";
    $db -> query($sql);
    $row = $db ->fetchRow();
    if (!$row["set_id"]) {
        $sql = $db ->sqlInsert("ca_rate_setting", $data_base);
        $q_id = $db->query($sql);
        return $q_id;
    }else {
        $sql = $db->sqlUpdate("ca_rate_setting", $data_base,"set_id = '{$row["set_id"]}' and rate_type = '1'");
        $db -> query($sql);
        $count = $db ->affectedRows();
        return $count;
    }
}
//======================================
// 函数: 插入ca_rate_setting提现基本信息
// 参数: data_base              用户基本信息数组
//         ca_id               用户id
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
function ins_ca_withdraw_rate_info($data_base)
{
    $db = new DB_COM();
    $sql = "SELECT set_id FROM ca_rate_setting WHERE rate_type = '2' and ca_id = '{$data_base["ca_id"]}' and ca_channel = '{$data_base["ca_channel"]}'";
    $db -> query($sql);
    $row = $db ->fetchRow();
    if (!$row["set_id"]) {
        $sql = $db ->sqlInsert("ca_rate_setting", $data_base);
        $q_id = $db->query($sql);
        if ($q_id == 0)
            return false;
        return true;
    }else {
        $sql = $db->sqlUpdate("ca_rate_setting", $data_base,"set_id = '{$row["set_id"]}' and rate_type = '2'");
        $db -> query($sql);
        $count = $db ->affectedRows();
        return $count;
    }
}
//======================================
// 函数: 获取有效的充值平均汇率
// 参数: time                  当前时间戳
// 返回: avg(base_rate)         平均值
//======================================
function get_average_ca_recharge_rate($time) {
    $db = new DB_COM();
    $sql = "SELECT avg(base_rate) FROM ca_rate_setting where rate_type = '1' and limit_time > '{$time}'";
    $db -> query($sql);
    $row = $db ->fetchRow();
    return $row;
}
//======================================
// 函数: 获取有效的提现平均汇率
// 参数: time                  当前时间戳
// 返回: avg(base_rate)         平均值
//======================================
function get_average_ca_withdraw_rate($time) {
    $db = new DB_COM();
    $sql = "SELECT avg(base_rate) FROM ca_rate_setting where rate_type = '2' and limit_time > '{$time}'";
    $db -> query($sql);
    $row = $db ->fetchRow();
    return $row;
}

//======================================
// 函数: 获取有效的充值的ca银行列表
// 参数: time                  当前时间戳
// 返回: new_rows              所有base_rate数组
//======================================
function  get_ca_recharge_settting_rate_list_by_bit_amount($base_amount,$time)
{
    $db = new DB_COM();
//    $sql = "SELECT distinct ca_channel FROM ca_rate_setting WHERE  '{$bit_amount}' > min_amount and '{$bit_amount}' < max_amount and rate_type = 1";
    $sql = "SELECT ca_channel,max(base_rate) FROM ca_rate_setting where rate_type = '1' and limit_time > '{$time}' and '{$base_amount}' >= min_amount and '{$base_amount}' <= max_amount group by ca_channel ";

    $db -> query($sql);
    $rows = $db -> fetchAll();
//    $new_rows = array();
//    foreach($rows as $row){
//        $new_row["ca_channel"] = $row["ca_channel"];
//        $sql = "SELECT base_rate FROM ca_rate_setting WHERE ca_channel = '{$row["ca_channel"]}' and rate_type = '1' and set_time > '{$time}'  order by base_rate desc limit 1";
//        $db -> query($sql);
//        $db_row = $db -> fetchRow();
//        $new_row["base_rate"] = floatval($db_row["base_rate"]);
//        $new_rows[] = $new_row;
//    }
//    return $new_rows;
//
//
//    $sql = "SELECT bit_type,max(base_rate) FROM ba_rate_setting where rate_type = '1' and limit_time > '{$time}' group by bit_type ";
//
//    $db -> query($sql);
//    $rows = $db -> fetchAll();
    return $rows;
}

//======================================
// 函数: 获取有效的充值的ca银行列表
// 参数: time                  当前时间戳
// 返回: new_rows              所有base_rate数组
//======================================
function  get_ca_withdraw_settting_rate_list_by_bit_amount($bit_amount,$time)
{
    $db = new DB_COM();
    $sql = "SELECT ca_channel,max(base_rate) FROM ca_rate_setting where rate_type = '2' and limit_time > '{$time}' and '{$bit_amount}' >= min_amount and '{$bit_amount}' <= max_amount group by ca_channel ";
//    $sql = "SELECT distinct ca_channel FROM ca_rate_setting WHERE  '{$bit_amount}' > min_amount and '{$bit_amount}' < max_amount and rate_type = 2";
    $db -> query($sql);
    $rows = $db -> fetchAll();
//    $new_rows = array();
//    foreach($rows as $row){
//        $new_row["ca_channel"] = $row["ca_channel"];
//        $sql = "SELECT base_rate FROM ca_rate_setting WHERE ca_channel = '{$row["ca_channel"]}' and rate_type = '2' and set_time > '{$time}'  order by base_rate desc limit 1";
//        $db -> query($sql);
//        $db_row = $db -> fetchRow();
//        $new_row["base_rate"] = floatval($db_row["base_rate"]);
//        $new_rows[] = $new_row;
//    }
    return $rows;
}
