<?php

/**
 * Created by PhpStorm.
 * User: liangyi
 * Date: 2018/8/1
 * Time: 上午11:37
 */
require_once "db/ba_bind.php";
require_once "../../../inc/common.php";
$args = array('ba_id');
chk_empty_args('GET', $args);
$ba_id =  get_arg_str('GET', 'ba_id');

$rows = get_ba_bind_info_by_token($ba_id);