<?php

require_once '../inc/common.php';
require_once "db/ca_bind.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 代理用户获取充值汇率 ==========================
GET参数
  token                   用户TOKEN
返回
  errcode = 0            请求成功
  ba_id                  代理商id
  recharge_min_amount    最低限额
  recharge_max_amount    最大限额
  recharge_us_level      用户等级
  recharge_set_time      有效时间
  recharge_bit_type      代理数字货币类型
  recharge_base_rate     汇率
说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
//验证token
$ca_id = check_token($token);
// 通过id获取用户基本信息
$rows = get_all_ca_bind_bit_address($ca_id);
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary["rows"] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
