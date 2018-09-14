<?php

require_once '../inc/common.php';
require_once "db/base_asset_account.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 代理用户获取充值汇率 ==========================
GET参数
  token                   用户TOKEN
返回
  errcode = 0            请求成功
  account_id              资产id
  base_id                 代理id
  bit_type                数字货币类型
  bit_address             数字货币地址
  bind_flag               绑定标志
  bind_agent_id           绑定用户ID
  bind_hash               绑定Hash
  utime                   更新时间
  ctime                   创建时间
说明
*/
php_begin();
$args = array('token');
chk_empty_args('GET', $args);
// 用户token
$token = get_arg_str('GET', 'token', 128);
//验证token
$ba_id = check_token($token);
// 通过id获取用户基本信息
$rows = get_ba_recharge_bit_account_info($ba_id);
$new_rows = array();
foreach ($rows as $row){
    $row["utime"] = date("Y-m-d H:i:s",$row["utime"]);

    $new_rows[] = $row;
}
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary["rows"] = $new_rows;

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
