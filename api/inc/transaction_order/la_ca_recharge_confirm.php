<?php
/**
 * Created by PhpStorm.
 * User: liangyi
 * Date: 2018/8/8
 * Time: 上午11:32
 */
require_once 'db/com_base_balance.php';
function base_ca_recharge_confirm($rows)
{

    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务


    $sql = "SELECT * FROM ca_base WHERE ca_id = '{$rows["agent_id"]}' limit 1";
    $db->query($sql);
    $ba_row = $db->fetchRow();

    $sql = "SELECT * FROM ba_base WHERE ba_id = '{$rows["base_id"]}' limit 1";
    $db->query($sql);
    $base_row = $db->fetchRow();


    $sql = "UPDATE base_recharge_request SET qa_flag = 1 WHERE base_id = '{$rows["base_id"]}' and qa_id = '{$rows["qa_id"]}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    if (!$count) {
        exit_error(1, "处理失败");
    }

    //增加us的该订单的base_amount
    $new_base_amount = $ba_row["base_amount"] + $rows["base_amount"];
    $sql = "UPDATE ca_base SET base_amount = '{$new_base_amount}' WHERE ca_id = '{$rows["agent_id"]}'";
    $db->query($sql);
    if (!$db->affectedRows($sql)) {
        $db->Rollback($pInTrans);
        exit_error("131", "交易失败");
    }

    //目前lock_amount-该订单的lock_amount
    $new_lock_amount = $base_row["lock_amount"] - $rows["base_amount"];
    if ($new_lock_amount < 0) {
        $db->Rollback($pInTrans);
        exit_error('134',"订单异常，金额不对,联系管理员");
    }

    //更新ba的该订单的loc_amount
    $sql = "UPDATE ba_base SET lock_amount = '{$new_lock_amount}' WHERE ba_id = '{$rows["base_id"]}'";
    $db->query($sql);
    if (!$db->affectedRows($sql)) {
        $db->Rollback($pInTrans);
        exit_error("132", "交易失败");
    }
//创建交易记录


    //base_amount值有所改变

    $sql = "SELECT * FROM ba_base WHERE ba_id = '{$rows["base_id"]}' limit 1";
    $db->query($sql);
    $new_base_row = $db->fetchRow();

    $sql = "SELECT * FROM ca_base WHERE ca_id = '{$rows["agent_id"]}' limit 1";
    $db->query($sql);
    $new_ba_row = $db->fetchRow();


    $us_type = 'ca_recharge_balance';
    $ctime = date('Y-m-d H:i:s');
    $us_ip = get_ip();
    $com_balance_us['hash_id'] = hash('md5', $rows["agent_id"] . $us_type . $us_ip . time() . rand(1000, 9999) . $ctime);
    $com_balance_us['tx_id'] = $rows["tx_hash"];
    $com_balance_us['prvs_hash'] = get_recharge_pre_hash($rows["agent_id"]);
    $com_balance_us["credit_id"] = $rows["agent_id"];
    $com_balance_us["debit_id"] = $rows["base_id"];
    $com_balance_us["tx_type"] = "ba_in";
    $com_balance_us["tx_amount"] = $rows["base_amount"];
    $com_balance_us["credit_balance"] = $new_ba_row["base_amount"]+$new_ba_row["lock_amount"];
    $com_balance_us["utime"] = time();
    $com_balance_us["ctime"] = $ctime;

    $sql = $db->sqlInsert("com_base_balance", $com_balance_us);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        exit_error("132", "交易失败");
    }

    $us_type = 'base_recharge_balance';
    $com_balance_ba['hash_id'] = hash('md5', $rows["base_id"] . $us_type . $us_ip . time() . rand(1000, 9999) . $ctime);
    $com_balance_ba['tx_id'] = $rows["tx_hash"];
    $com_balance_ba['prvs_hash'] = get_recharge_pre_hash($rows["base_id"]);
    $com_balance_ba["credit_id"] = $rows["base_id"];
    $com_balance_ba["debit_id"] = $rows["agent_id"];
    $com_balance_ba["tx_type"] = "ba_in";
    $com_balance_ba["tx_amount"] = $rows["base_amount"];
    $com_balance_ba["credit_balance"] = $new_base_row["base_amount"] + $new_base_row["lock_amount"];
    $com_balance_ba["utime"] = time();
    $com_balance_ba["ctime"] = $ctime;

    $sql = $db->sqlInsert("com_base_balance", $com_balance_ba);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        exit_error("132", "交易失败");
    }

    $db->Commit($pInTrans);
}