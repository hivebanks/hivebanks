<?php

//======================================
// 获取la的基本信息
// 参数:
// 返回: row         la基本信息数组
//======================================
function get_la_base()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM la_base limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}