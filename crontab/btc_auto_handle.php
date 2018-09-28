<?php

$data = file_get_contents("key.json");
$json = json_decode($data, true);
var_dump($json);

$ba_id = $json["ba_id"];
$key = $json["key"];

var_dump($ba_id);
var_dump($key);





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
