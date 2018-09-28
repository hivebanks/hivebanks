<?php

//======================================
// 函数: 获取us_ba_withdraw_request基本信息
// 参数: $ba_id                      用户ba_id
// 返回: $row                        基本信息数组
//         asset_id                 充值资产ID
//         bit_amount               数字货币金额
//         base_amount              充值资产金额
//         tx_time                  请求时间戳
//         tx_hash                  交易HASH
//         us_id                    用户ID
//         qa_id                    请求ID
//         ba_id                    代理商ID
//         tx_detail                交易明细（JSON）
//         ba_account_id            代理商账号ID（Hash）
//======================================
function  get_ba_withdraw_log_balance()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_ba_withdraw_request";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}

//======================================
// 函数: 获取us_ba_withdraw_request基本信息
// 参数: $us_id                      用户id
// 返回: $row                        基本信息数组
//         asset_id                 充值资产ID
//         bit_amount               数字货币金额
//         base_amount              充值资产金额
//         tx_time                  请求时间戳
//         tx_hash                  交易HASH
//         us_id                    用户ID
//         qa_id                    请求ID
//         ba_id                    代理商ID
//         tx_detail                交易明细（JSON）
//         ba_account_id            代理商账号ID（Hash）
//======================================
function  get_us_ba_withdraw_log_balance()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_ba_withdraw_request";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}

function  get_us_ba_withdraw_log_balance_limt($from_time,
                                              $to_time,
                                              $ba_id,
                                              $qa_id,
                                              $us_id,
                                              $ba_id,
                                              $asset_id,
                                              $us_account_id,
                                              $bit_amount,
                                              $base_amount,
                                              $tx_type,
                                              $tx_detail,
                                              $tx_fee,
                                              $qa_flag,
                                              $tx_hash)
{
    $where = '';
    if($from_time){
        $where .= "tx_time >= '{$from_time}'";
    }
    if($to_time){
        if($where){
            $where .= "AND tx_time <= '{$to_time}'";
        }else{
            $where .= "tx_time <= '{$to_time}'";
        }
    }
    if($ba_id){
        if($where){
            $where .= "AND ba_id = '{$ba_id}'";
        }else{
            $where .= "ba_id = '{$ba_id}'";
        }
    }
    if($qa_id){
        if($where){
            $where .= "AND qa_id = '{$qa_id}'";
        }else{
            $where .= "qa_id = '{$qa_id}'";
        }
    }
    if($us_id){
        if($where){
            $where .= "AND us_id = '{$us_id}'";
        }else{
            $where .= "us_id = '{$us_id}'";
        }
    }
    if($asset_id){
        if($where){
            $where .= "AND asset_id = '{$asset_id}'";
        }else{
            $where .= "asset_id = '{$asset_id}'";
        }
    }
    if($us_account_id){
        if($where){
            $where .= "AND us_account_id = '{$us_account_id}'";
        }else{
            $where .= "us_account_id = '{$us_account_id}'";
        }
    }
    if($bit_amount){
        if($where){
            $where .= "AND bit_amount = '{$bit_amount}'";
        }else{
            $where .= "bit_amount = '{$bit_amount}'";
        }
    }
    if($base_amount){
        if($where){
            $where .= "AND base_amount = '{$base_amount}'";
        }else{
            $where .= "base_amount = '{$base_amount}'";
        }
    }
    if($tx_hash){
        if($where){
            $where .= "AND tx_hash = '{$tx_hash}'";
        }else{
            $where .= "tx_hash = '{$tx_hash}'";
        }

    }
    if($tx_detail){
        if($where){
            $where .= "AND tx_detail = '{$tx_detail}'";
        }else{
            $where .= "tx_detail = '{$tx_detail}'";
        }
    }
    if($tx_fee){
        if($where){
            $where .= "ADN tx_fee = '{$tx_fee}'";
        }else{
            $where .= "tx_fee = '{$tx_fee}'";
        }

    }
    if($qa_flag){
        if($where){
            $where .= "AND qa_flag = '{$qa_flag}'";
        }else{
            $where .= "qa_flag = '{$qa_flag}'";
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
        $sql = "SELECT * FROM us_ba_withdraw_request where $where";
    }else{
        $sql = "SELECT * FROM us_ba_withdraw_request";
    }
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}

