<?php

require_once "../inc/common.php";


/*
 *===============================得到所有要充值的=================
 *
 */

php_begin();
$rows = get_recharge_quest();
var_dump($rows);






























function get_recharge_quest()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_ba_recharge_request where qa_flag = 1";
    $db->query($sql);
    $rows = $db->fetchAll();

    return $rows;
}
