<?php

require_once "../inc/common.php";


/*
 *===============================得到所有要充值的=================
 *
 */

php_begin();
$rows = get_recharge_quest();



foreach ($rows as $request) {
    echo $request['base_amount'] . "\n";

    echo $request['tx_hash'] . "\n";
}







function get_recharge_quest()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_ba_recharge_request where qa_flag = 0";
    $db->query($sql);
    $rows = $db->fetchAll();

    return $rows;
}
