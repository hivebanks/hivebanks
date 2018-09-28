<?php

//======================================
// 获取用户充值总和
// 参数:begin_limit_time       查询起始时间
//      end_limit_time        查询截至时间
// 返回:rows                       信息数组
//      sum(base_amount)           基准资金总和
//======================================
function get_sum_us_ca_recharge_request_info($begin_limit_time,$end_limit_time)
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
        $sql = "SELECT sum(base_amount) FROM us_ca_recharge_request where '{$where}'";
    }else{
        $sql = "SELECT sum(base_amount) FROM us_ca_recharge_request";
    }
    $db = new DB_COM();
//    $sql = "SELECT sum(base_amount) FROM us_ca_recharge_request where tx_time >= '{$begin_limit_time}' and tx_time <= '{$end_limit_time}'";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}
//======================================
// 获取ca的充值总和根据时间
// 参数:begin_limit_time      查询起始时间
//      end_limit_time        查询截至时间
// 返回:rows                       信息数组
//     ca_id                       caID
//      sum(base_amount)           基准资金总和
//======================================
function get_ca_recharge_amount_from_us_ca_recharge_request($begin_limit_time,$end_limit_time)
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
        $sql = "SELECT ca_id,sum(base_amount) FROM us_ca_recharge_request where qa_flag = 1 and '{$where}' group by ca_id ";
    }else{
        $sql = "SELECT ca_id,sum(base_amount) FROM us_ca_recharge_request where qa_flag = 1  group by ca_id ";
    }
    $db = new DB_COM();
//    $sql = "SELECT ca_id,sum(base_amount) FROM us_ca_recharge_request where qa_flag = 1 and tx_time >= '{$begin_limit_time}' and tx_time <= '{$end_limit_time}' group by ca_id ";
    $db->query($sql);
    $row = $db->fetchAll();
    return $row;
}
//======================================
// 获取用户充值总和根据时间
// 参数:begin_limit_time      查询起始时间
//      end_limit_time        查询截至时间
// 返回:rows                       信息数组
//     us_id                       用户ID
//      sum(base_amount)           基准资金总和
//======================================
function get_us_recharge_amount_from_us_ca_recharge_request()
{
    $db = new DB_COM();
    $sql = "SELECT us_id,sum(base_amount) FROM us_ca_recharge_request where qa_flag = 1 group by us_id ";
    $db->query($sql);
    $row = $db->fetchAll();
    return $row;
}
