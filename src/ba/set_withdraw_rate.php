<?php

require_once '../inc/common.php';
require_once 'db/ba_base.php';
require_once 'db/la_base.php';
require_once 'db/ba_bind.php';
require_once 'db/ba_rate_setting.php';
require_once "db/com_option_config.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 提现汇率设定 ==========================
GET参数
  token                   用户TOKEN
  withdraw_rate           充值汇率
  withdraw_min_amount     最小提现金额
  withdraw_max_amount     最大提现金额
  limit_time              截止时间
  pass_word_hash           密码hash
返回
  errcode = 0             请求成功
说明
*/

php_begin();
$args = array('token','withdraw_rate','withdraw_min_amount','withdraw_max_amount','limit_time','pass_word_hash');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
// 充值汇率
$withdraw_rate = get_arg_str('GET', 'withdraw_rate');
// 最小充值金额
$withdraw_min_amount = get_arg_str('GET', 'withdraw_min_amount');
// 最大充值金额
$withdraw_max_amount = get_arg_str('GET', 'withdraw_max_amount');
// 截止时间
$limit_time = get_arg_str('GET', 'limit_time');
// 用户等级
$withdraw_us_level = get_arg_str('GET', 'withdraw_us_level');
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');

//验证token
$ba_id = check_token($token);
$time_row = get_ba_valid_time()["option_value"];
if ($time_row + time() > strtotime($limit_time))
    exit_error("144","有效期必须要大于la设置的时间");

$pass_word_login = 'password_login';
// 获取pass_word_hash
if(get_pass_word_hash($ba_id,$pass_word_login) != $pass_word_hash)
    exit_error("102","密码错误");

$row_fail = array();
$variable = 'cellphone';
//可以加用户是否存在判断
$bit_type = get_ba_base_info($ba_id)['ba_type'];
$data_recharge_pass = array();
$data_bind_pass['ba_id'] = $ba_id;
$data_bind_pass['rate_type'] = "2";
$data_bind_pass['base_rate'] = $withdraw_rate;
$data_bind_pass['us_level'] = $withdraw_us_level;
$data_bind_pass['min_amount'] = $withdraw_min_amount * $withdraw_rate * get_la_base_unit();
$data_bind_pass['max_amount'] = $withdraw_max_amount * $withdraw_rate * get_la_base_unit();
$data_bind_pass['limit_time'] = ($limit_time);
$data_bind_pass['set_time'] =  time();
$data_bind_pass['bit_type'] = $bit_type;
if(!ins_ba_withdraw_rate_info($data_bind_pass)){
    exit_error('101',"设置失败");
}
exit_ok();

