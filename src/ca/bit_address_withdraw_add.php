<?php

require_once '../inc/common.php';
require_once 'db/ca_base.php';
require_once "db/ca_bind.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 设定数字货币充值地址 ==========================
GET参数
   token           用户TOKEN
   bit_addree      数字货币充值地址
返回
   errcode = 0     请求成功

说明
*/

php_begin();
$args = array('token', 'bit_address');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
// 地址
$bit_address = get_arg_str('GET', 'bit_address');
//验证token
$ca_id = check_token($token);
if (get_ca_bind_bit_address_by_ca_id($ca_id,$bit_address))
    exit_error("143","地址已存在");
$data_base = array();
$data_base['ca_id'] = $ca_id;
$data_base['bind_id'] = get_guid();
$data_base['bind_type'] = 'text';
$data_base['bind_name'] = 'bit_address';
$data_base['bind_info'] = $bit_address;
$data_base['bind_flag'] = 0;
if(!ins_bind_ca_reg_bind_info($data_base))
    exit_error("101","设置失败");

//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['bit_address'] = $bit_address;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
