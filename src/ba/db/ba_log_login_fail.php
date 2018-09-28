<?php

//======================================
// 函数: 获取ba_log_login_fail基本信息
// 参数: ba_id            用户ba_id
// 返回: row              用户基本信息数组
//         count_error    登录错误次数
//         limt_time      限制时间戳
//======================================
function  get_row_by_ba_id($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_log_login_fail WHERE ba_id = '{$ba_id}' order by limt_time DESC limit 1 ";
    $db -> query($sql);
    $row = $db -> fetchRow($sql);
    return $row;
}

//======================================
// 函数: 插入ba_log_login_fail用户基本信息
// 参数: data_base           基本信息数组
//         count_error       登录错误次数
//         limt_time         限制时间戳
// 返回: true           插入成功
// 返回: false          插入失败
//======================================
function creat_ba_log_login_fail($row)
{
    $db = new DB_COM();
    $sql = $db->sqlInsert("ba_log_login_fail", $row);
    $q_id = $db->query($sql);
    if ($q_id == 0)
        return 0;
    return $db->insertID();
}

//======================================
// 函数: 登录成功删除所有相关数据
// 参数: ba_id          ba用户id
// 返回: count          删除的行数
//======================================
function delect_ba_log_login_fail($ba_id)
{
    $db = new DB_COM();
    $sql = "DELETE  FROM ba_log_login_fail WHERE ba_id = '{$ba_id}'";
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}
