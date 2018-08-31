<?php
//======================================
// 函数: 获取最新登录失败数据
// 参数: us_id        用户id
// 返回: row          登陆失败的最新数据
//======================================
function  get_row_by_us_id($us_id)
{  
    $db = new DB_COM();
    $sql = "SELECT * FROM us_log_login_fail WHERE us_id = '{$us_id}' order by limt_time DESC limit 1 ";
    $db -> query($sql);
    $row = $db -> fetchRow($sql);
    return $row;
}
//======================================
// 函数: 创建登录失败记录
// 参数: row             用户登录失败信息数组
// 返回: id               记录id 
//======================================
function creat_us_log_login_fail($row)
{  
  $db = new DB_COM();
  $sql = $db->sqlInsert("us_log_login_fail", $row);
  $q_id = $db->query($sql);
  if ($q_id == 0)
    return 0;
  return $db->insertID();
}
//======================================
// 函数: 登录成功删除所有相关数据
// 参数: us_id          用户id
// 返回: count          删除的行数
//======================================
function delect_us_log_login_fail($us_id)
{
  $db = new DB_COM();
  $sql = "DELETE  FROM us_log_login_fail WHERE us_id = '{$us_id}'";
  $db -> query($sql);
  $count = $db -> affectedRows();
  return $count; 
}
