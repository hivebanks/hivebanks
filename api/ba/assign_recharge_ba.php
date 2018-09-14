<?php

require_once '../inc/common.php';
require_once 'db/ba_base.php';
require_once 'db/la_base.php';
require_once 'db/ba_rate_setting.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 分配充值ba ==========================
GET参数
   token           请求的用户token
   bit_type        数字货币类型
返回
    errcode = 0     请求成功
    ba_id           代理商id
    min_amount      最低限额
    max_amount      最大限额
    base_rate       汇率
    set_time        有效时间
    us_level        用户等级要求
说明
*/

php_begin();
$args = array('token', 'bit_type');
chk_empty_args('GET', $args);

$cfm_code = get_arg_str('GET', 'us_id');
$bit_type = get_arg_str('GET', 'bit_type');
$token = get_arg_str('GET', 'token', 128);

//验证token
$us_id = check_token($token);
if (BASE_CURRENCY == $bit_type){
    $rows = ba_get_base_ba_settting_rate_ba_id($bit_type);
    $data['min_amount'] = "0";
    $data['max_amount'] = $rows["base_amount"];
    $data['base_rate'] = 1;
    $data['set_time'] = "无限制";
    $data['us_level'] = 0;
    $ba_id = $rows["ba_id"];
}else {
    // 分配ba
    $ba_id = us_get_ba_settting_rate_ba_id($bit_type);
//获取充值汇率基本信息
    $data = get_ba_settting_recharge_rate_ba_id($ba_id);
    $data["set_time"] = date('Y-m-d H:i', $data['set_time']);
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['ba_id'] = $ba_id;
$rtn_ary['min_amount'] = floatval($data['min_amount']) * floatval($data['base_rate']) / get_la_base_unit();
$rtn_ary['max_amount'] = floatval($data['max_amount']) * floatval($data['base_rate']) / get_la_base_unit();
$rtn_ary['base_rate'] = floatval($data['base_rate']);
$rtn_ary['set_time'] =  $data['set_time'];
$rtn_ary['us_level'] = $data['us_level'];

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
