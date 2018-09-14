<?php

/**
 * Created by PhpStorm.
 * User: liangyi
 * Date: 2018/9/6
 * Time: 上午11:15
 */

function get_la_admin_info()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM la_admin  limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}


