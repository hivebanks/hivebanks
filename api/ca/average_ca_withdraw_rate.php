<?php

require_once '../inc/common.php';
require_once 'db/ca_rate_setting.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取ca提现汇率的平均值 ==========================
GET参数
  token          请求的用户token
返回
  errcode = 0              请求成功
  withdraw_rate            提现汇率平均值
说明
*/

php_begin();
$args = array("token");
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
//验证taoken
$us_id = check_token($token);
$rate = get_average_ca_withdraw_rate(time())['avg(base_rate)'];
//返回给前端数据
$rtn_data['errcode'] = '0';
$rtn_data['errmsg'] = '';
$rtn_data['withdraw_rate'] = floatval($rate);
php_end(json_encode($rtn_data));
