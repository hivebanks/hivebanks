<?php

require_once "db/ba_bind.php";
require_once "db/ba_base.php";
require_once "../../../inc/common.php";
require_once "../../../ba/db/la_base.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取ba详细信息 ==========================
GET参数
  ba_id         baID
返回
rows            信息数组
  security_level  安全等级
  ba_type        代理商
  ba_level         代理商等级
  lock_amount   绑定金额
  base_amount   可用金额
  utime        更新时间
  ctime        创建时间
说明
*/

$args = array('ba_id');
chk_empty_args('GET', $args);

$ba_id =  get_arg_str('GET', 'ba_id');
$rows = get_ba_bind_info_by_token($ba_id);
//获取汇率
$base_unit = get_la_base_unit();
$base_row = get_ba_base_info_by_ba_id($ba_id);
$rows["security_level"] = $base_row["security_level"];
$rows["ba_level"] = $base_row["ba_level"];
$rows["ba_type"] = $base_row["ba_type"];
$rows["lock_amount"] = $base_row["lock_amount"]/$base_unit;
$rows["base_amount"] = $base_row["base_amount"]/$base_unit;
$rows["ctime"] = $base_row["ctime"];
$rows["utime"] = $base_row["utime"];
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
