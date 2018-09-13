<?php
//======================================
//  查询la是否存在
// 参数: id           la的id
// 返回:count        影响的行数
//======================================
function get_la_by_user($id){
    $db = new DB_COM();
    $sql = "select * from la_admin where id='{$id}' ";
    $db->query($sql);
    return $count = $db->affectedRows();
}

function upd_la_admin_key_code($la_id,$key_code) {
    $db = new DB_COM();
    $sql = "UPDATE la_admin SET key_code = '{$key_code}' WHERE id = '{$la_id}'";

    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}