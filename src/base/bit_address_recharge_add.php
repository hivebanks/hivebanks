<?php

require_once '../inc/common.php';
require_once 'db/ba_base.php';
require_once "db/la_base.php";
require_once 'db/base_asset_account.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 设定数字货币充值地址 ==========================
GET参数
   token           用户TOKEN
   bit_addree      数字货币充值地址
   is_void         是否无效（1 有效 2 无效）
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
// 是否有效
$is_void = get_arg_str('GET', 'is_void');
//验证token
$ba_id = check_token($token);

//根据ba_id获取基本信息
$row = get_ba_base_info($ba_id);
if ($row["ba_type"] != get_la_base_base_currency())
    exit_error("144","只有基准ba才能添加充值地址");
//整理插入db数据
$data_bind_pass['base_id'] = $ba_id;
$data_bind_pass['bit_type'] = $row["ba_type"];
$data_bind_pass['bind_flag'] = "0";
$data_bind_pass['ctime'] = date("Y-m-d H:i:s");
$lgn_type = 'bit_address';
$utime = time() . rand(1000, 9999);
$ctime = date('Y-m-d H:i:s');
$us_ip = get_ip();
$data_bind_pass['account_id'] = hash('md5', $ba_id . $lgn_type . $us_ip . $utime . $ctime);
$data_bind_pass["bit_address"] = $bit_address;
//判断地址是否已经存在
if(sel_ba_recharge_bit_account_info($ba_id,$bit_address))
    exit_error("103","地址重复");
//如果不存在，插入db
if (!ins_ba_recharge_bit_account_info($data_bind_pass)) {
    exit_error("101","设置失败");
}
//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary["bind_address"] = $bit_address;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);


?>