<?php

//======================================
// 获取ba资产总和从数据表中根据时间
// 参数:begin_limit_time           查询起始时间
//      end_limit_time             查询截至时间
// 返回:rows                       信息数组
//      sum(base_amount)           基准资金总和
//======================================
function get_ba_sum_us_ba_withdraw_request_info($begin_limit_time,$end_limit_time)
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
        $sql = "SELECT sum(base_amount) FROM us_ba_withdraw_request where '{$where}'";
    }else{
        $sql = "SELECT sum(base_amount) FROM us_ba_withdraw_request";
    }
    $db = new DB_COM();
//    $sql = "SELECT sum(base_amount) FROM us_ba_withdraw_request where tx_time >= '{$begin_limit_time}' and tx_time <= '{$end_limit_time}'";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 获取ba下的us的提现总和
// 参数:begin_limit_time      查询起始时间
//      end_limit_time        查询截至时间
// 返回:rows                       信息数组
//      asset_id                   资产id
//      sum(base_amount)           基准资金总和
//======================================
function get_ba_us_ba_withdraw_request_info($begin_limit_time,$end_limit_time)
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
        $sql = "SELECT asset_id,sum(base_amount) FROM us_ba_withdraw_request where qa_flag = 1 and '{$where}' group by  asset_id ";
    }else{
        $sql = "SELECT asset_id,sum(base_amount) FROM us_ba_withdraw_request where qa_flag = 1  group by  asset_id ";
    }
    $db = new DB_COM();
//    $sql = "SELECT asset_id,sum(base_amount) FROM us_ba_withdraw_request where qa_flag = 1 and tx_time >= '{$begin_limit_time}' and tx_time <= '{$end_limit_time}' group by  asset_id ";
    $db->query($sql);
    $row = $db->fetchAll();
    return $row;
}
//======================================
// 获取ba的提现总和
// 参数:begin_limit_time      查询起始时间
//      end_limit_time        查询截至时间
// 返回:rows                       信息数组
//      ba_id                      baID
//      sum(base_amount)           基准资金总和
//======================================
function get_ba_withdraw_amount_from_us_ba_withdraw_request($begin_limit_time,$end_limit_time)
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
        $sql = "SELECT ba_id,sum(base_amount) FROM us_ba_withdraw_request where qa_flag = 1 and '{$where}' group by ba_id ";
    }else{
        $sql = "SELECT ba_id,sum(base_amount) FROM us_ba_withdraw_request where qa_flag = 1  group by ba_id ";
    }
    $db = new DB_COM();
//    $sql = "SELECT ba_id,sum(base_amount) FROM us_ba_withdraw_request where qa_flag = 1 and tx_time >= '{$begin_limit_time}' and tx_time <= '{$end_limit_time}' group by ba_id ";
    $db->query($sql);
    $row = $db->fetchAll();
    return $row;
}
//======================================
// 获取用户的提现总和
// 参数:
// 返回:rows                       信息数组
//      us_id                      用户ID
//      sum(base_amount)           基准资金总和
//======================================
function get_us_withdraw_amount__from_us_ba_withdraw_request()
{

    $db = new DB_COM();
    $sql = "SELECT us_id,sum(base_amount) FROM us_ba_withdraw_request where qa_flag = 1 group by us_id ";
    $db->query($sql);
    $row = $db->fetchAll();
    return $row;
}
