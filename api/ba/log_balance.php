<?php

require_once '../inc/common.php';
require_once 'db/com_base_balance.php';
require_once "db/la_base.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 账户变动记录查询 ==========================
GET参数
  token                用户token
  limit                分页记录
  offset               分页偏移量

返回
    total              总记录数
    rows               记录数组
      tx_type          变动类型（ca_in/out：CA充值提现，ba_in/out：BA充值提现 us_in/out：用户充值/提现）
      tx_amount        变动金额
      credit_balance   变动后账户余额
      hash_id          交易HASH
      ctime            变动时间
说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');
//验证token
$ba_id = check_token($token);
// 获取当前用户的交易记录
$newrows = array();
$rows = get_log_balance($ba_id);
foreach ($rows as $row) {
    $newrow["tx_type"] = $row["tx_type"];
    $newrow["tx_amount"] = $row["tx_amount"] / get_la_base_unit();
    $newrow["credit_balance"] = $row["credit_balance"] / get_la_base_unit();
    $newrow["hash_id"] = $row["hash_id"];
    $newrow["ctime"] = $row["ctime"];
    $newrows[] = $newrow;
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $newrows ? $newrows : [];
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
