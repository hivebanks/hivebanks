<?php

//======================================
//  查询la是否存在
// 参数: id           la的ID
// 返回: count        影响的行数
//======================================
function get_la_by_user($id){
    $db = new DB_COM();
    $sql = "select * from la_admin where id='{$id}' ";
    $db->query($sql);
    return $count = $db->affectedRows();
}
//======================================
//  修改保证金前检查密码
// 参数: user_id        admin user 的id
// 参数: password       admin user 的密码
// 返回:
//       boolean
//======================================
function password_check($user_id,$password)
{
    $db = new DB_COM();
    $sql = "select pwd from la_admin where id = '{$user_id}'";
    $db->query($sql);
    $res = $db->fetchRow();
    if($password != $res['pwd'])
        exit_error('-1','密码错误');
}
