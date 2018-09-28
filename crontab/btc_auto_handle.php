<?php

echo "test";




foreach ($rows as $request) {
    echo $request['base_amount'] . "\n";

    echo $request['tx_detail'] . "\n";


}







function get_recharge_quest()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM us_ba_recharge_request where qa_flag = 0";
    $db->query($sql);
    $rows = $db->fetchAll();

    return $rows;
}
