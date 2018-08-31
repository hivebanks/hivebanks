<?php
/**
 * Created by PhpStorm.
 * User: liangyi
 * Date: 2018/8/8
 * Time: 下午2:52
 */
function us_withdraw_quest($data) {

    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务
    $sql = $db ->sqlInsert("base_withdraw_request", $data);
    $row =  $db->query($sql);
    if (!$row){
        exit_error('132', "订单交易失败");
    }

    $sql = "SELECT base_amount,lock_amount FROM ba_base WHERE ba_id = '{$data["agent_id"]}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    if ($rows["base_amount"] < $data["base_amount"]) {
        $db->Rollback($pInTrans);
        exit_error("132","无法达成交易，您的保证金不足");
    }
    $new_base_amount = $rows["base_amount"] - $data["base_amount"];
    $new_lock_amount = $rows["lock_amount"] + $data["base_amount"];
    $sql = "UPDATE ba_base SET base_amount = '{$new_base_amount}', lock_amount = '{$new_lock_amount}' WHERE ba_id = '{$data["agent_id"]}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    if (!$count){
        $db->Rollback($pInTrans);
        exit_error('101', "更新失败");
    }
    $db->Commit($pInTrans);
}

