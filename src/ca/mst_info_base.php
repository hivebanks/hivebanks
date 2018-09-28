<?php

require_once '../inc/common.php';
require_once 'db/ca_base.php';
require_once 'db/la_base.php';
require_once 'db/us_ca_recharge_request.php';
require_once 'db/us_ca_withdraw_request.php';
require_once 'db/ca_rate_setting.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取代理商基本信息 ==========================
GET参数
  token               用户TOKEN
返回
  ca_id           代理商ID
  bit_type        代理数字货币类型
  base_amount     基准资产余额
  lock_amount     锁定余额
  security_level  安全等级
  ca_level        代理商等级
  count_recharge  充值未处理条数
  count_withdraw  提现未处理条数
说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
//验证token
$ca_id = check_token($token);
// 通过id获取用户基本信息
$row = get_ca_base_info($ca_id);
//获取未处理充值订单数量
$count_recharge = get_ca_recharge_amount_request_ca_id($ca_id);
//获取未处理提现订单数量
$count_withdraw = get_ca_withdraw_amount_request_ca_id($ca_id);
// 给前端返回的数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['ca_id'] =$ca_id;
$rtn_ary['base_amount'] = $row["base_amount"] / get_la_base_unit();
$rtn_ary['lock_amount'] =$row["lock_amount"] / get_la_base_unit();
$rtn_ary['security_level'] =$row["security_level"];
$rtn_ary['ca_account'] = $row["ca_account"];
$rtn_ary['ca_level'] = $row["ca_level"];
$rtn_ary['count_recharge'] = $count_recharge["count(*)"];
$rtn_ary['count_withdraw'] = $count_withdraw["count(*)"];
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
