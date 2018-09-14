<?php

//======================================
//  获取ba绑定信息
// 参数: $ba_id        baID
// 返回: rows          信息数组
//  bind_id                绑定ID
//  ba_id                  baID
//  bind_type              绑定类型
//  bind_name              绑定名称
//  bind_info              绑定内容
//  bind_flag              绑定标志
//  utime                  更新时间
//  ctime                  创建时间
//======================================
function  get_ba_bind_info_by_token($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_bind WHERE ba_id = '{$ba_id}'";
    $db->query($sql);
    $row = $db ->fetchAll();
    return $row;
}
