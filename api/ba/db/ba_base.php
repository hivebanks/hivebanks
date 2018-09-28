<?php
function get_ba_base_info($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_base WHERE ba_id = '{$ba_id}'";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;

}