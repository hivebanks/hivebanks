<?php

//======================================
// 函数: 获取us_ca_recharge_request基本信息
// 参数: $ca_id                      用户ca_id
//
// 返回: $row                        基本信息数组
//         asset_id                 充值资产ID
//         bit_amount               数字货币金额
//         base_amount              充值资产金额
//         tx_time                  请求时间戳
//         tx_hash                  交易HASH
//         us_id                    用户ID
//         qa_id                    请求ID
//         ca_id                    代理商ID
//         tx_detail                交易明细（JSON）
//         ca_account_id            代理商账号ID（Hash）
//======================================
function  get_ca_recharge_log_balance()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_ca_recharge_request";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
//======================================
// 函数: 获取us_ca_recharge_request基本信息
// 返回: $row                        基本信息数组
//         asset_id                 充值资产ID
//         bit_amount               数字货币金额
//         base_amount              充值资产金额
//         tx_time                  请求时间戳
//         tx_hash                  交易HASH
//         us_id                    用户ID
//         qa_id                    请求ID
//         ca_id                    代理商ID
//         tx_detail                交易明细（JSON）
//         ca_account_id            代理商账号ID（Hash）
//======================================
function  get_us_ca_recharge_log_balance()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_ca_recharge_request";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}

function get_us_ca_recharge_log_balance_limt($from_time,
                                             $to_time,
                                             $ca_id,
                                             $qa_id,
                                             $us_id,
                                             $ca_account_id,
                                             $lgl_amount,
                                             $base_amount,
                                             $tx_type,
                                             $tx_detail,
                                             $tx_fee,
                                             $qa_flag,
                                             $tx_hash)
{
    $where = '';
    if($from_time){
        $where .= "tx_time >= '{$from_time}' ";
    }
    if($to_time){
        if($where){
            $where .= "AND tx_time <= '{$to_time}' ";
        }else{
            $where .= "tx_time <= '{$to_time}' ";
        }

    }
    if($ca_id){
        if($where){
            $where .= "AND ca_id = '{$ca_id}' ";
        }else{
            $where .= "ca_id = '{$ca_id}' ";
        }
    }
    if($qa_id){
        if($where){
            $where .= "AND qa_id = '{$qa_id}' ";
        }else{
            $where .= "qa_id = '{$qa_id}' ";
        }

    }
    if($us_id){
        if($where){
            $where .= "AND us_id = '{$us_id}' ";
        }else{
            $where .= "us_id = '{$us_id}' ";
        }
    }
    if($ca_account_id){
        if($where){
            $where .= "AND ca_account_id = '{$ca_account_id}' ";
        }else{
            $where .= "ca_account_id = '{$ca_account_id}' ";
        }

    }
    if($lgl_amount){
        if($where){
            $where .= "AND lgl_amount = '{$lgl_amount}' ";
        }else{
            $where .= "lgl_amount = '{$lgl_amount}' ";
        }

    }
    if($base_amount){
        if($where){
            $where .= "AND base_amount = '{$base_amount}' ";
        }else{
            $where .= "base_amount = '{$base_amount}' ";
        }

    }
    if($tx_hash){
        if($where){
            $where .= "AND tx_hash = '{$tx_hash}' ";
        }else{
            $where .= "tx_hash = '{$tx_hash}' ";
        }

    }
    if($tx_detail){
        if($where){
            $where .= "AND tx_detail = '{$tx_detail}' ";
        }else{
            $where .= "tx_detail = '{$tx_detail}' ";
        }

    }
    if($tx_fee){
        if($where){
            $where .= "AND tx_fee = '{$tx_fee}'";
        }else{
            $where .= "tx_fee = '{$tx_fee}'";
        }

    }
    if($qa_flag){
        if($where){
            $where .= "AND qa_flag = '{$qa_flag}' ";
        }else{
            $where .= "qa_flag = '{$qa_flag}' ";
        }

    }
    if($tx_type){
        if($where){
            $where .= "AND tx_type = '{$tx_type}'";
        }else{
            $where .= "tx_type = '{$tx_type}'";
        }

    }
    $db = new DB_COM();
    if($where){
        $sql = "SELECT * FROM us_ca_recharge_request where $where";
    }else{
        $sql = "SELECT * FROM us_ca_recharge_request";
    }

    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
?>
