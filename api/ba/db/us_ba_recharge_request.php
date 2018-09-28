<?php

require_once 'com_base_balance.php';


/*
 *查询所有的交易哈希
 *
 */
function get_recharge_quest_block_txhash($ba_id) {
    $db = new DB_COM();
    $sql = "SELECT block_tx_hash FROM us_ba_recharge_request where ba_id= '{$ba_id}'";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}


function sel_recharge_info($tx_hash) {
    $db = new DB_COM();
    $sql = "SELECT * FROM us_ba_recharge_request WHERE tx_hash = '{$tx_hash}'";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}


/*
 * 函数：根据充值状态，获取用户充值信息列表us_ba_recharge_request中的项目
 * 参数: ba_id                用户ba_id
 *      qa_flag                 订单状态
 * 返回： rows                 所有满足条件的充值订单
 *          asset_id                 充值资产ID
 *         bit_amount               数字货币金额
 *         base_amount              充值资产金额
 *         tx_time                  请求时间戳
 *         tx_hash                  交易HASH
 *         us_id                    用户ID
 *         qa_id                    请求ID
 *         ba_id                    代理商ID
 *         tx_detail                交易明细（JSON）
 *          ba_account_id            代理商账号ID（Hash）
 */
function get_ba_recharge_request($ba_id, $qa_flag) {
    $db = new DB_COM();
    $sql = "SELECT * FROM us_ba_recharge_request WHERE ba_id='{$ba_id}' AND qa_flag = '{$qa_flag}'";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}




function set_processed_recharge() {

}

function auto_recharge_confirm($row, $block_tx_hash)
{
    $db = new DB_COM();
    $pInTrans = $db->StartTrans();

    $sql = "SELECT * FROM us_base WHERE us_id = '{$row["us_id"]}'";
    $db->query($sql);
    $us_row =  $db->fetchRow();

    $sql = "SELECT * FROM ba_base WHERE ba_id = '{$row["ba_id"]}'";
    $db->query($sql);
    $ba_row = $db->fetchRow();


    $sql = "UPDATE us_ba_recharge_request SET qa_flag = 2, block_tx_hash = '{$block_tx_hash}' WHERE ba_id = '{$row["ba_id"]}' and tx_hash = '{$row["tx_hash"]}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    if(!$count) {
        exit_error(1, "handle failed");
    }

    //增加user的该订单的base_amount
    $new_base_amount = $us_row["base_amount"] + $row["base_amount"];
    $sql = "UPDATE us_base SET base_amount = '{$new_base_amount}' WHERE us_id = '{$row["us_id"]}'";
    $db->query($sql);
    if(!$db->affectedRows($sql)) {
        $db->Rollback($pInTrans);
        exit_error("131", "transaction failed");
    }

    //目前lock_amount - 减去该订单的lock_amount
    $new_lock_amount = $ba_row["lock_amount"] - $row["base_amount"];
    if($new_lock_amount<0) {
        $db->Rollback($pInTrans);
        exit_error("134", "transaction error");
    }

    //更新订单的lock_amount
    $sql = "UPDATE ba_base SET lock_amount = '{$new_lock_amount}' WHERE ba_id = '{$row['ba_id']}'";
    $db->query($sql);
    if(!$db->affectedRows($sql)) {
        $db->Rollback($pInTrans);
        exit_error("132", "transaction failed");
    }




    //创建交易记录
    //base_amount值有所变化
    $sql = "SELECT * FROM us_base WHERE us_id = '{$row["us_id"]}' ";
    $db->query($sql);
    $new_us_row = $db->fetchRow();

    $sql = "SELECT * FROM ba_base WHERE ba_id = '{$row["ba_id"]}'";
    $db->query($sql);
    $new_ba_row = $db->fetchRow();

    $us_type = 'us_recharge_balance';
    $ctime = date('Y-m-d H:i:s');
    $us_ip = get_ip();
    $com_balance_us['hash_id'] = hash('md5', $row["us_id"] . $us_type . $us_ip . time() . rand(1000, 9999) . $ctime);
    $com_balance_us['tx_id'] = $row["tx_hash"];
    $com_balance_us["prvs_hash"] = ba_get_recharge_prev_hash($row["us_id"]);
    $com_balance_us["credit_id"] = $row["ba_id"];
    $com_balance_us["debit_id"] = $row["us_id"];
    $com_balance_us["tx_type"] = "ba_in";
    $com_balance_us["tx_amount"] = $row["base_amount"];
    $com_balance_us["credit_balance"] = $new_us_row["base_amount"] + $new_us_row["lock_amount"];
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = $ctime;


    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if(!$db->query($sql)) {
        $db->Rollback($pInTrans);
        exit_error("132", "transaction Failed");
    }

    $us_type = 'ba_recharge_balance';
    $com_balance_ba['hash_id'] = hash('md5', $row["ba_id"] . $us_type . $us_ip . time() . rand(1000, 9999) . $ctime);
    $com_balance_ba['tx_id'] = $row["tx_hash"];
    $com_balance_ba['prvs_hash'] = ba_get_recharge_prev_hash($row["ba_id"]);
    $com_balance_ba["credit_id"] = $row["ba_id"];
    $com_balance_ba["debit_id"] = $row["us_id"];
    $com_balance_ba["tx_type"] = "ba_in";
    $com_balance_ba["tx_amount"] = $row["base_amount"];
    $com_balance_ba["credit_balance"] = $new_ba_row["base_amount"] + $new_ba_row["lock_amount"];
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;

    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        exit_error("132", "交易失败");
    }

    $db->Commit($pInTrans);



}

