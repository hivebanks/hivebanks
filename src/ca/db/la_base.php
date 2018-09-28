<?php

//======================================
// 函数: 获取ca数字货币单位
// 参数:
// 返回: row            信息数组
//======================================
function get_la_base_unit()
{
    $db = new DB_COM();
    $sql = "SELECT unit FROM la_base limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows["unit"];
}
