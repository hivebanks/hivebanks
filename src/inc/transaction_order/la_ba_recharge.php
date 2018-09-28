<?php

/**
 * Created by PhpStorm.
 * User: liangyi
 * Date: 2018/8/8
 * Time: 上午9:59
 */

function us_recharge_quest($data,$utime) {
    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务

    $sql = "SELECT base_amount,lock_amount FROM ba_base WHERE ba_id = '{$data["base_id"]}' limit 1";
    $db -> query($sql);
    $rows = $db -> fetchRow();
    if ($rows["base_amount"] < $data["base_amount"]) {
        exit_error("1","无法达成交易，基准ba的保证金不足");
    }
    $new_base_amount = floatval($rows["base_amount"]-$data["base_amount"]);
    $new_lock_amount = floatval($rows["lock_amount"]+$data["base_amount"]);
    $sql = "UPDATE ba_base SET base_amount = '{$new_base_amount}', lock_amount = '{$new_lock_amount}' WHERE ba_id = '{$data["base_id"]}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    if (!$count) {
        $db->Rollback($pInTrans);
        exit_error("132","交易失败");
    }
    $sql = $db ->sqlInsert("base_recharge_request", $data);

    $q_id = $db->query($sql);
    if (!$q_id){
        exit_error("133", "创建充值订单失败");
    }


    $sql = "UPDATE base_asset_account SET bind_flag = '1', bind_agent_id = '{$data["agent_id"]}', utime = '{$utime}' WHERE base_id = '{$data["base_id"]}' and account_id = '{$data["base_account_id"]}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    if (!$count){
        $db->Rollback($pInTrans);
        exit_error("101", "更新信息失败");
    }

    $db->Commit($pInTrans);
}