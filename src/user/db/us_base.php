<?php

/**
 * @param $invite_check
 * @return bool
 */

function invite_code_check($invite_check){

    $db = new DB_COM();
    $sql = "select us_nm from us_base where us_nm={$invite_check}";
    $db->query($sql);
    if($db->fetchRow())
        return true;
    return false;

}
//======================================
// 函数: 创建注册用户
// 参数: data        信息数组
// 返回: true         创建成功
//       false        创建失败
//======================================
function ins_base_user_reg_base_info($data_base)
{
    $data_base['base_amount'] = 0;
    $data_base['lock_amount'] =0;
    $data_base['us_level'] = 0;
    $data_base['security_level'] = 2;
    $data_base['utime'] = time();
    $data_base['ctime'] = date("Y-m-d H:i:s");
    $db = new DB_COM();
    $sql = $db ->sqlInsert("us_base", $data_base);
    $q_id = $db->query($sql);
    if ($q_id == 0)
      return false;
    return true;
}
//======================================
// 函数: 获取用户基本信息
// 参数: token               用户token
// 返回: rows                用户基本信息数组
//         us_id            用户id
//         rest_amount      用户可用余额
//         lock_amount      用户锁定余额
//         security_level   用户安全等级
//======================================
function get_us_base_info_by_token($us_id)
{
  $db = new DB_COM();
  $sql = "SELECT * FROM us_base WHERE us_id = '{$us_id}'";
  $db->query($sql);
  $row = $db->fetchRow();
  return $row;
}
//======================================
// 函数: 获取用户安全等级
// 参数: us_id            用户id
// 返回: security_level   用户安全等级
//======================================
function get_us_security_level_by_token($us_id)
{
  $db = new DB_COM();
  $sql = "SELECT security_level FROM us_base WHERE us_id = '{$us_id}'";
  $db->query($sql);
  $security_level = $db->getField($sql,'security_level');
  return $security_level;
}
//======================================
// 函数: 更新用户基本信息数据
// 参数: data_base            用户信息数组
// 返回: true                  成功
//       false                 失败
//======================================
function upd_us_base($data_base){
    $db = new DB_COM();
    $data_base['ctime'] = time();
    $where = "us_id = '{$data_base['us_id']}'";
    $sql = $db -> sqlUpdate('us_base', $data_base, $where);
    $id = $db -> query($sql);
    if($id == 0){
        return false;
    }
    return true;
}
//======================================
// 函数: 更新用户安全等级数据
// 参数: us_id                用户id
// 返回: true                  成功
//       false                 失败
//======================================
function  upd_savf_level($us_id,$savf_level)
{
    $db = new DB_COM();
    $sql = "UPDATE us_base SET security_level = '{$savf_level}' WHERE us_id = '{$us_id}'";
    $id = $db -> query($sql);
    if($id == 0){
        return false;
    }
    return true;
}
//======================================
// 函数: 检测用户是否存在
// 参数: us_id                用户id
// 返回: row                  用户信息数组
//======================================
function chexk_us_exit($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_base WHERE us_id = '{$us_id}'";
    $db -> query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 函数: 更新用户的昵称
// 参数: us_id            用户id
//      us_account       用户的昵称
// 返回: id               成功id
//======================================
function  upd_us_accout($us_id,$us_account)
{
    $db = new DB_COM();
    $sql = "UPDATE us_base SET us_account = '{$us_account}' WHERE us_id = '{$us_id}'";
    $id = $db -> query($sql);
    return $id;
}
