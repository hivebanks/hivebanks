<?php

//======================================
// 获取ca资金总和
// 参数:
// 返回:rows                       信息数组
//      sum(base_amount)           基准资金总和
//      sum(lock_amount)            锁定资金总和
//======================================
function get_ca_sum_amout_info()
{
    $db = new DB_COM();
    $sql = "SELECT sum(base_amount),sum(lock_amount) FROM ca_base";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 获取注册ca数量
// 参数:
// 返回: rows           数量
//======================================
function get_ca_sum_register_amout_info($begin_limit_time,$end_limit_time)
{
    $where ='';
    if($begin_limit_time){
        $where .= "tx_time >= '{$begin_limit_time}'";
    }
    if($end_limit_time){
        if($where){
            $where .= "AND tx_time <= '{$end_limit_time}'";
        }else{
            $where .= "tx_time <= '{$end_limit_time}'";
        }
    }
    if($where){
        $sql = "SELECT count(*) FROM ca_base where '{$where}'";
    }else{
        $sql = "SELECT count(*) FROM ca_base ";
    }
    $db = new DB_COM();
//    $sql = "SELECT count(*) FROM ca_base where ctime >= '{$begin_limit_time}' and ctime <= '{$end_limit_time}'";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}
