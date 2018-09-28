<?php

//======================================
//  获取黑名单列表信息
// 参数: us_id         用户id
//       time          时间戳
// 返回: rows          信息数组
//   log_id       绑定日志ID
//   us_id        用户ID
//   black_type   处罚性质：1：禁止登录 2 禁止提现 3 禁止充值
//   black_info   处罚原因
//   ttl_id       操作者ID
//   limt_time    处罚到期时间戳
//======================================
function get_black_list_info_by_us_id($us_id,$time)
{
    $db = new DB_COM();
    $sql = "select  *  from la_black_list where ctime in (select max(ctime) as ctime from la_black_list group by black_type) and us_id = '{$us_id}' and limt_time > '{$time}'";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
//======================================
//  获取指定类型的黑名单列表信息
// 参数: us_id         用户id
//       time          时间戳
//       type          处罚性质
// 返回: rows          信息数组
//   log_id       绑定日志ID
//   us_id        用户ID
//   black_type   处罚性质：1：禁止登录 2 禁止提现 3 禁止充值
//   black_info   处罚原因
//   ttl_id       操作者ID
//   limt_time    处罚到期时间戳

//======================================
function get_black_list_info_by_us_id_and_type($us_id,$time,$type)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM la_black_list where us_id = '{$us_id}' and limt_time > '{$time}' and black_type = '{$type}' limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
//  插入黑名单列表信息
// 参数: data          信息数组
//   log_id       绑定日志ID
//   us_id        用户ID
//   black_type   处罚性质：1：禁止登录 2 禁止提现 3 禁止充值
//   black_info   处罚原因
//   ttl_id       操作者ID
//   limt_time    处罚到期时间戳
//  返回
//   q_id          插入id

//======================================
function ins_black_list_info($data)
{
    $db = new DB_COM();
    $sql = $db ->sqlInsert("la_black_list", $data);
    $q_id = $db->query($sql);
    return $q_id;
}
