<?php

require_once "db/us_bind.php";
require_once "db/us_base.php";
require_once "../../../inc/common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取us详细信息 ==========================
GET参数
  us_id         usID
返回
rows            信息数组
  security_level  安全等级
  us_level       用户等级
  lock_amount   绑定金额
  base_amount   可用金额
  utime        更新时间
  ctime        创建时间
说明
*/

$args = array('us_id');
chk_empty_args('GET', $args);

$us_id =  get_arg_str('GET', 'us_id');
$rows = get_us_bind_info_by_token($us_id);
$base_row = get_us_base_info_by_us_id($us_id);
$rows["security_level"] = $base_row["security_level"];
$rows["us_level"] = $base_row["us_level"];
$rows["lock_amount"] = $base_row["lock_amount"];
$rows["base_amount"] = $base_row["base_amount"];
$rows["ctime"] = $base_row["ctime"];
$rows["utime"] = $base_row["utime"];
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
