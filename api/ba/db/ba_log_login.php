<?php

//======================================
// 函数: 获取用户登录前一个hash
// 参数: us_id        用户id
// 返回: prvs_hash    前次登录的hash
//======================================
function  get_pre_hash($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM ba_log_login WHERE ba_id = '{$us_id}' ORDER BY  ctime DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}
//======================================
// 函数: 创建登陆记录
// 参数: lgn_data        用户登录数组
// 返回: 0               失败
//       insID          成功
//======================================
function  ins_ba_lgn_login($log_data)
{
    $db = new DB_COM();
    $sql = $db->sqlInsert("ba_log_login", $log_data);
    $q_id = $db->query($sql);
    if ($q_id == 0)
        return 0;
    return $db->insertID();
}
//======================================
// 函数: 获取用户登录记录总数
// 参数: us_id        用户id
// 返回: count        记录总数
//======================================
function  get_lgn_log_total($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_log_login WHERE ba_id = '{$us_id}'";
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}
//======================================
// 函数: 获取用户登录信息
// 参数: us_id            用户id
//      limit            每页页数
//      offset           偏移量
// 返回: rows             用户登录信息数组
//         lgn_type           登录类型(email:邮件账号，phone:手机账号，oauth:第三方)
//         us_ip             登录ip
//         ip_area        登录地区
//         ctime              登录时间
//======================================
function get_lgn_log($us_id,$limit,$offset)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_log_login ";
    $sql .= "WHERE ba_id = '{$us_id}'";
    $sql .= " ORDER BY utime DESC";
    $sql .= " limit {$offset},{$limit}";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
