<?php

//======================================
//  获取us绑定信息
// 参数: $us_id        用户id
// 返回: rows          信息数组
//  bind_id                绑定ID
//  us_id                  用户ID
//  bind_type              绑定类型
//  bind_name              绑定名称
//  bind_info              绑定内容
//  bind_flag              绑定标志
//  utime                  更新时间
//  ctime                  创建时间
//======================================
function  get_us_bind_info_by_token($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_bind WHERE us_id = '{$us_id}'";
    $db->query($sql);
    $row = $db ->fetchAll();
    return $row;
}
