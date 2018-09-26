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






function set_processed_recharge() {

}

function recharge_confirm($row)
{
    $db = new DB_COM();
    $pInTrans = $db->StartTrans();

    $sql = "SELECT * FROM us_base WHERE us_id = '{$row["us_id"]}'";
    $db->query($sql);
    $us_row =  $db->fetchRow();

    $sql = "SELECT * FROM ba_base WHERE ba_id = '{$row["ba_id"]}'";
    $db->query($sql);
    $ba_row = $db->fetchRow();


    $sql = "UPDATE us_ba_recharge_request SET qa_flag = 1 WHERE ba_id = '{$row["ba_id"]}' and qa_id = '{$row["qa_id"]}'";
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
    $com_balance_us["prvs_hash"] = get_recharge_pre_hash($row["us_id"]);
    $com_balance_us["credit_id"] = $row["ba_id"];
    $com_balance_us["debit_id"] = $row["us_id"];
    $com_balance_us["tx_type"] = "ba_in";
    $com_balance_us["tx_amount"] = $row["base_amount"];
    $com_balance_us["credit_balance"] = $new_us_row["base_amount"] + $new_us_row["lock_amount"];
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = $ctime;


    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if($db->query($sql)) {
        $db->Rollback($pInTrans);
        exit_error("132", "transaction Failed");
    }

    $us_type = 'ba_recharge_balance';
    $com_balance_ba['hash_id'] = hash('md5', $row["ba_id"] . $us_type . $us_ip . time() . rand(1000, 9999) . $ctime);
    $com_balance_ba['tx_id'] = $row["tx_hash"];
    $com_balance_ba['prvs_hash'] = get_recharge_pre_hash($row["ba_id"]);
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

