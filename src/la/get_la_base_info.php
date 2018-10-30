<?php

/**
 * Created by PhpStorm.
 * User: liangyi
 * Date: 2018/8/8
 * Time: 下午4:48
 */
require_once "db/la_base.php";
require_once "../inc/common.php";
require_once "admin/db/com_option_config.php";
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");
/*
========================== 获取la基本信息 ==========================
GET参数
  token               用户TOKEN
返回
   rows                 信息数组
    id                   la的id
    base_currency         基准货币类型
    unit                   单位
    h5_url                 h5页面url
    api_url                接口url
说明
*/
php_begin();
$args = array("token");

chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);

$key = Config::TOKEN_KEY;
// 获取token并解密
$des = new Des();
$decryption_code = $des -> decrypt($token, $key);
$now_time = time();
$code_conf =  explode(',',$decryption_code);
// 获取token中的需求信息
$user = $code_conf[0];
$timestamp = $code_conf[1];
if($timestamp < $now_time){
    exit_error('114','Token timeout please retrieve!');
}

$row = get_la_base();
if (get_configure_key())
    $row["api_key"] = get_configure_key()["option_value"];

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['row'] = $row;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);