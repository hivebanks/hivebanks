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
========================== 充值汇率设定 ==========================
GET参数
  token                   用户TOKEN
  recharge_rate           充值汇率
  recharge_min_amount     最小充值金额
  recharge_max_amount     最大充值金额
  limit_time              截止时间
  is_void                 是否无效（0 有效 1 无效）
返回
  errcode = 0             请求成功
说明
*/

php_begin();
$args = array('token', 'recharge_rate', 'recharge_min_amount', 'recharge_max_amount', 'limit_time','pass_word_hash');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
// 充值汇率
$recharge_rate = get_arg_str('GET', 'recharge_rate');
// 最小充值金额
$recharge_min_amount = get_arg_str('GET', 'recharge_min_amount');
// 最大充值金额
$recharge_max_amount = get_arg_str('GET', 'recharge_max_amount');
// 用户等级
$recharge_us_level = get_arg_str('GET', 'recharge_us_level');
// 截止时间
$limit_time = get_arg_str('GET', 'limit_time');
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');
// 是否有效
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
$bit_type = get_ba_base_info($ba_id)['ba_type'];
$data_recharge_pass = array();
$data_bind_pass['ba_id'] = $ba_id;
$data_bind_pass['rate_type'] = "1";
$data_bind_pass['base_rate'] = $recharge_rate;
$data_bind_pass['us_level'] = $recharge_us_level;
$data_bind_pass['min_amount'] = $recharge_min_amount / $recharge_rate * get_la_base_unit();
$data_bind_pass['max_amount'] = $recharge_max_amount / $recharge_rate * get_la_base_unit();
$data_bind_pass['limit_time'] = $limit_time;
$data_bind_pass['set_time'] = time();
$data_bind_pass['bit_type'] = $bit_type;
if(!ins_ba_recharge_rate_info($data_bind_pass)){
    exit_error('101',"设置失败");
}
exit_ok();
