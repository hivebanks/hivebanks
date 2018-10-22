<?php

/**
 * @return array
 */
function get_la_base_unit()
{
    $db = new DB_COM();
    $sql = "SELECT unit FROM la_base";
    $db->query($sql);
    return $db->fetchRow();
}