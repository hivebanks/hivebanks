<?php

//======================================
// 获取设定的账户单位
// 参数:
// 返回: unit   资金单位
//======================================
function get_la_base_unit()
{
    $db = new DB_COM();
    $sql = "SELECT unit FROM la_base limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row["unit"];
}
