<?php

//======================================
//  查询la
// 参数: user         la的ID
// 返回:
//       count        影响的行数
//======================================
function get_la_by_user($id){
    $db = new DB_COM();
    $sql = "select * from la_admin where id='{$id}' ";
    $db->query($sql);
    return $count = $db->affectedRows();
}
