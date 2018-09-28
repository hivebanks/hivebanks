<?php

require_once '../inc/common.php';
require_once 'db/la_base.php';
require_once 'db/ca_rate_setting.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 分配充值ca ==========================
GET参数
  token          请求的用户token
  ca_channel      法定货币渠道

返回
  errcode = 0     请求成功
  ca_id           代理商id
  min_amount      最低限额
  max_amount      最大限额
  base_rate       汇率
  set_time        有效时间
  us_level        用户等级要求
说明
*/

php_begin();
$args = array('token', 'ca_channel');
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);
// 用户token
$ca_channel = get_arg_str('GET', 'ca_channel');

//验证taoken
$us_id = check_token($token);

$ca_id = us_get_ca_recharge_settting_rate_ca_id($ca_channel);
//获取充值汇率基本信息
$data = get_ca_settting_recharge_rate_ca_id($ca_id);
// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['ca_id'] = $ca_id;
$rtn_ary['min_amount'] = floatval($data['min_amount']) * floatval($data['base_rate']) / get_la_base_unit();
$rtn_ary['max_amount'] = floatval($data['max_amount']) * floatval($data['base_rate']) / get_la_base_unit();
$rtn_ary['base_rate'] = floatval($data['base_rate']);
$rtn_ary['set_time'] = date('Y-m-d H:i', $data['set_time']);
$rtn_ary['us_level'] = $data['us_level'];

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
