<?php

//======================================
//  获取基准ba的汇率
// 参数: bit_type      基准货币类型
// 返回：ba_id          ba_id
//======================================
function  ba_get_base_ba_settting_rate_ba_id($bit_type)
{
    $db = new DB_COM();
    $sql = "SELECT ba_id FROM ba_base where ba_type = '{$bit_type}' order by base_amount desc limit 1";
    $db -> query($sql);
    $ba_id = $db -> getField($sql,'ba_id');
    return $ba_id;
}
