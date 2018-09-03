<?php
require_once "../inc/common.php";
require_once "../ca/db/us_base.php";
require_once "../ca/db/ca_base.php";
require_once "../ca/db/com_base_balance.php";
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);


sel_recharge_quest_info();

//可优化：批量处理
function sel_recharge_quest_info()
{

    $db = new DB_COM();
    $sql = "SELECT * FROM us_ca_recharge_request WHERE qa_flag = 0 limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();

    if ($rows["tx_time"] + 3 * 60 * 60 * 24 < time()) {
        $handle=fopen("crontab_recharge_confirm.log","a+");
        $rows_str = json_encode($rows);
        fwrite($handle,"$rows_str\n");
        fclose($handle);
        if ($rows["qa_flag"] == 0){
            $db = new DB_COM();
            $sql = "UPDATE us_ca_recharge_request SET qa_flag = 2 WHERE ca_id = '{$rows["ca_id"]}' and qa_id = '{$rows["qa_id"]}'";
            $db->query($sql);
            $count = $db->affectedRows($sql);
            if (!$count) {
                exit_error('101',"处理失败");
                return;
            }



//获取us基本用户信息
            $base_row = get_us_base_info($rows["us_id"]);
            $new_base_amount = $base_row["base_amount"] + $rows["base_amount"];
//增加us_base的该订单的base_amount
            if (!upd_us_recharge_base_amount_info($rows["us_id"],$new_base_amount))
                exit_error('101',"更新失败,请联系管理员");
//减掉ca_base的该订单的lock_amount

            if (!upd_ca_lock_amount_info($rows["ca_id"], $rows["base_amount"]))
                exit_error('101',"更新失败");
            $ca_row = get_ca_base_info($rows["ca_id"]);

//创建交易记录
            $us_type = 'us_recharge_balance';
            $ctime = date('Y-m-d H:i:s');
            $us_ip = get_ip();
            $com_balance_us['hash_id'] = hash('md5', $rows["us_id"] . $us_type . $us_ip . time().rand(1000,9999) . $ctime);
            $com_balance_us['tx_id'] = $rows["tx_hash"];
            $com_balance_us["credit_id"] = $rows["us_id"];
            $com_balance_us['prvs_hash'] = get_ca_recharge_pre_hash($rows["us_id"]);
            $com_balance_us["debit_id"] = $rows["ca_id"];
            $com_balance_us["tx_type"] =  "ca_in";
            $com_balance_us["tx_amount"] =  $rows["base_amount"];
            $com_balance_us["credit_balance"] = $new_base_amount;
            $com_balance_us["utime"] = time();
            $com_balance_us["ctime"] = $ctime;
            if (!ins_us_rechargeAndwithdraw_com_base_banlance($com_balance_us))
                exit_error('101',"更新失败");
            $us_type = 'ca_recharge_balance';
            $com_balance_ba['hash_id'] = hash('md5', $rows["ca_id"] . $us_type . $us_ip . time().rand(1000,9999) . $ctime);
            $com_balance_ba['tx_id'] = $rows["tx_hash"];
            $com_balance_ba["credit_id"] = $rows["ca_id"];
            $com_balance_ba["debit_id"] = $rows["us_id"];
            $com_balance_ba['prvs_hash'] = get_ca_recharge_pre_hash($rows["ca_id"]);
            $com_balance_ba["tx_type"] =    "ca_in";
            $com_balance_ba["tx_amount"] =  $rows["base_amount"];
            $com_balance_ba["credit_balance"] = $ca_row["base_amount"] + $ca_row["lock_amount"];
            $com_balance_ba["utime"] = time();
            $com_balance_ba["ctime"] = $ctime;
            if (!ins_ca_rechargeAndwithdraw_com_base_banlance($com_balance_ba))
                exit_error('101',"更新失败");

        }


    }

}