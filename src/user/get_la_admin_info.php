<?php

/**
 * Created by PhpStorm.
 * User: liangyi
 * Date: 2018/9/6
 * Time: 上午11:18
 */

require_once "db/la_admin.php";
require_once "../inc/common.php";

php_begin();
$args = array('token');
chk_empty_args('GET', $args);
// 用户token
$token = get_arg_str('GET', 'token', 128);
//验证token
$ba_id = check_token($token);

$la_id = get_la_admin_info()["id"];

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['la_id'] = $la_id;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
