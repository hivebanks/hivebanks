<?php

//======================================
// 插入用户交易记录
// 参数: data         信息数组
// 返回: true         成功
//       false       失败
//======================================
function us_base_action($data){
    $db = new DB_COM();
    $sql = $db->sqlInsert('com_base_balance',$data);
    $res = $db->query($sql);
    if($res)
        return true;
    else
        return false;
}
//======================================
// 获取交易前置hash
// 参数: credit_id        借方id
// 返回: hash_id          hashid
//======================================
function get_prvs_hash($credit_id){
    $db = new DB_COM();
    $sql = "select hash_id from com_base_balance where credit_id = '{$credit_id}' order by utime desc limit 1";
    $db->query($sql);
    $res = $db->fetchRow();
    return $res;
}
