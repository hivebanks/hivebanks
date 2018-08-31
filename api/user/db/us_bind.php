<?php
//======================================
// 函数: 获取variable和acount通过获取最新用户信息
// 参数: account      账号
//       variable    绑定name
// 返回: row          最新信息数组
//======================================
function get_us_id_by_variable($variable , $account)
{
  $db = new DB_COM();
  $sql = "SELECT us_id,bind_flag,bind_info FROM us_bind WHERE bind_name = '{$variable}' AND bind_info = '{$account}' AND bind_flag = '1' ORDER BY utime DESC LIMIT 1 ";
  $db -> query($sql);
  $row = $db -> fetchRow();
  return $row;
}
//======================================
// 函数: 创建用户绑定信息
// 参数: data_bind          绑定信息数组
// 返回： true               成功
//        false             失败
//======================================
function ins_bind_user_reg_bind_info($data_bind)
{
  $data_bind['utime'] = time();
  $data_bind['ctime'] = date("Y-m-d H:i:s");
  $db = new DB_COM();
  $sql = $db->sqlInsert("us_bind", $data_bind);
  $q_id = $db->query($sql);
  if ($q_id == 0)
    return false;
  return true;
}
//======================================
// 函数: 获取用户绑定信息
// 参数: token            用户token
// 返回: rows             用户绑定信息数组
//======================================
function  get_us_bind_info_by_token($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_bind WHERE us_id = '{$us_id}' AND bind_flag = 1";
    $db->query($sql);
    $row = $db ->fetchAll();
    return $row;
}
//======================================
// 函数: 获取用户绑定信息(手机)
// 参数: token            用户token
// 返回: rows             用户绑定信息数组
//======================================
function  get_us_bind_phone_by_token($us_id,$cellphone)
{
    $db = new DB_COM();
    $sql = "SELECT bind_info FROM us_bind WHERE us_id = '{$us_id}' AND bind_name ='{$cellphone}'  AND bind_flag = 1";
    $db->query($sql);
    $bind_info = $db->getField($sql,'bind_info');
    return $bind_info;
}
//======================================
// 函数: 添加绑定信息
// 参数: us_id         用户id
// 返回: data_bind     bind数组
// 返回:true           成功
//     false          失败
//======================================
function bind_info($us_id, $data_bind)
{
  $data_bind['us_id'] = $us_id;
  $data_bind['bind_id'] = get_guid();
  $data_bind['utime'] = time();
  $data_bind['ctime'] = date("Y-m-d H:i:s");
  $db = new DB_COM();
  $sql = $db->sqlInsert('us_bind', $data_bind);
  $q_id = $db->query($sql);
  if ($q_id == 0)
    return false;
  return true;
}
//======================================
// 函数: 判断绑定是否存在
// 参数: data_bind       绑定信息数组
// 返回: count           影响的行数
//======================================
function  check_bind_info($data_bind)
{
  $db = new DB_COM();
  $sql = "SELECT * FROM us_bind WHERE bind_name = '{$data_bind['bind_name']}' AND bind_info = '{$data_bind['bind_info']}' AND bind_type = '{$data_bind['bind_type']}' AND bind_flag = '1'";
  $db -> query($sql);
  $count = $db -> affectedRows();
  return $count;
}
//======================================
// 函数: 获取用户密码hash
// 参数: us_id            用户id
// 返回: pass_word_hash   用户密码hash
//======================================
function get_pass_word_hash($us_id,$pass_word_login)
{
  $db = new DB_COM();
  $sql = "SELECT bind_info FROM us_bind WHERE us_id = '{$us_id}' AND  bind_name = '{$pass_word_login}' AND bind_flag = '1'";
  $db->query($sql);
  $pass_word_hash = $db->getField($sql,'bind_info');
  return $pass_word_hash;
}
//======================================
// 函数: 检测密码是否正确
// 参数: pass_word_hash       密码HASH
//      us_id                用户id
// 返回:count                影响的行数
//======================================

function check_pass($us_id,$pass_word_hash,$variable)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_bind WHERE us_id = '{$us_id}' AND bind_info = '{$pass_word_hash}' AND bind_name = '{$variable}' AND bind_flag = '1'";
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}
//======================================
// 函数: 重置密码
// 参数: us_id                用户id
//       pass_word_hash       新密码HASH
// 返回: count
//        大于0               成功
//======================================
function upd_pass_for_us_id($us_id,$pass_word_hash)
{
  $db = new DB_COM();
  $sql = "UPDATE us_bind SET bind_info = '{$pass_word_hash}' WHERE us_id = '{$us_id}' AND bind_name = 'password_login' AND bind_flag = '1'";
  $db -> query($sql);
  $count = $db -> affectedRows();
  return $count;
}
//======================================
// 函数: 判断绑定是否存在
// 参数: cellphone_num       手机信息
// 返回: count               影响的行数
//======================================
function get_user_bind_phone($cellphone_num)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_bind WHERE bind_info = '{$cellphone_num}' AND bind_flag = 1 ";
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}
//======================================
// 函数: 获取用户绑定个数
// 参数: us_id               用户id
// 返回: count               绑定数
//======================================
function get_bind_acount($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_bind WHERE us_id = '{$us_id}' AND bind_flag = 1";
    $db->query($sql);
    $acount = $db ->affectedRows();
    return $acount;
}

//======================================
// 函数: 获取用户资金密码hash
// 参数: us_id            用户id
//       pass             绑定类型
// 返回: pass_hash        用户资金密码hash
//======================================
function get_pass_hash($us_id,$vail)
{
    $db = new DB_COM();
    $sql = "SELECT bind_info FROM us_bind WHERE us_id = '{$us_id}' AND  bind_name = '{$vail}' AND bind_flag = '1'";
    $db->query($sql);
    $pass_hash = $db->getField($sql,'bind_info');
    return $pass_hash;
}

//======================================
// 函数: 用户绑定信息更新
// 参数: us_id                用户id
//      bind_info            绑定信息
// 返回: count
//         大于0               成功
//======================================
function upd_bind_info_for_us_id($us_id,$bind_name)
{
    $db = new DB_COM();
    $sql = "UPDATE us_bind SET bind_flag = '9'  WHERE us_id = '{$us_id}' AND bind_name = '{$bind_name }'";
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}
//======================================
// 函数: 获取用户绑定的邮箱
// 参数: us_id                用户id
// 返回: email                用户邮箱
//======================================
function get_us_bind_email_by_us_id($us_id,$vail){
    $db = new DB_COM();
    $sql = "SELECT bind_info FROM us_bind WHERE us_id = '{$us_id}' AND  bind_name = '{$vail}' AND bind_flag = '1'";
    $db->query($sql);
    $email = $db->getField($sql,'bind_info');
    return $email;
}
//======================================
// 函数: 绑定谷歌确认写入绑定表
// 参数: us_id                用户id
// 返回: count                影响行数
//======================================
function ins_google_bind($bind_data){
    $bind_data['utime'] = time();
    $bind_data['ctime'] = date("Y-m-d H:i:s");
    $db = new DB_COM();
    $sql = $db->sqlInsert("us_bind", $bind_data);
    $q_id = $db->query($sql);
    if ($q_id == 0)
        return false;
    return true;
}
