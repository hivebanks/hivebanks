<?php

require_once '../inc/common.php';
require_once 'db/us_base.php';
require_once 'db/us_bind.php';
require_once 'db/la_base.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取用户基本信息 ==========================
GET参数
  token               用户TOKEN
返回
  us_id                用户id
  base_amount          可用余额
  lock_amount          锁定余额
  security_level       安全等级
  us_level             用户等级
  ctime                创建时间
说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);
// 用户token
$token = get_arg_str('GET', 'token',100);

// 验证token
$us_id = check_token($token);
// 通过id获取用户基本信息
$row = get_us_base_info_by_token($us_id);
$row["base_amount"] = $row["base_amount"] / get_la_base_unit();
$row["lock_amount"] = $row["lock_amount"] / get_la_base_unit();

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] =$row;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

