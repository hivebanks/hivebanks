<?php

//======================================
//  获取ca绑定信息
// 参数:
// 返回: rows          信息数组
//  bind_id                绑定ID
//  ca_id                  caID
//  bind_type              绑定类型
//  bind_name              绑定名称
//  bind_info              绑定内容
//  bind_flag              绑定标志
//  utime                  更新时间
//  ctime                  创建时间
//======================================
function  get_ca_bind_info_by_token($ca_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ca_bind WHERE ca_id = '{$ca_id}'";
    $db->query($sql);
    $row = $db ->fetchAll();
    return $row;
}
