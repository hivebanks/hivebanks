<?php

require_once 'db/com_option_config.php';
require_once "../inc/common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取ba类型 ==========================
GET参数

返回
  errcode = 0         成功
  rows                信息数组
      option_name        选项名称
      option_key         选项关键字
      option_value       选项内容
      option_sort        选项排序
      sub_id             模块ID
      status             有效标志
      option_src          选项链接
说明
*/

php_begin();
$rows = get_ba_bit_type();
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
