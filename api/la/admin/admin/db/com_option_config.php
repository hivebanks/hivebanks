<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/8/15
 * Time: 上午11:32
 */

function www_reg_permission($type){

    $db = new DB_COM();

    switch ($type){
        case 'ba':
            $sql =  "select option_name ,option_value as is_open from com_option_config where option_name = 'ba_lock'";
            break;
        case 'ca':
            $sql =  "select option_name ,option_value as is_open from com_option_config where option_name = 'ca_lock'";
            break;
        case 'us':
            $sql =  "select option_name ,option_value as is_open from com_option_config where option_name = 'user_lock'";
            break;
        default:

            break;
    }


    $db->query($sql);
    return $db->fetchAll();
}

function www_reg_permission_modify($type,$status)
{

    $db = new DB_COM();
    switch ($type){
        case 'ba':
            $option_name = 'ba_lock';
            $sql =  "update com_option_config set option_value = '$status' where option_name = '$option_name'";
            break;
        case 'ca':
            $option_name = 'ca_lock';
            $sql =  "update com_option_config set option_value = '$status' where option_name = '$option_name'";
            break;
        case 'us':
            $option_name = 'user_lock';
            $sql =  "update com_option_config set option_value = '$status' where option_name = '$option_name'";
            break;
        default:
            break;
    }
    $db->query($sql);
    return $db->affectedRows();


}

function admin_reg_permission_list()
{

    $db = new DB_COM();
    $sql = "select option_name ,option_value as is_open from com_option_config where option_name in ('ba_lock','ca_lock','user_lock')";
    $db->query($sql);
    return $db->fetchAll();

}