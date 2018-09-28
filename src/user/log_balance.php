<?php

require_once '../inc/common.php';
require_once 'db/us_log_balance.php';
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
  total                总记录数
  rows                 记录数组
    tx_type            变动类型(ca_in/out:CA充值提现，ba_in/out:BA充值提现，us_in/out:用户转入转出)
    chg_amount         变动金额
    chg_balance        变动后账户余额
    tx_hash          交易HASH
    ctime              变动时间
说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',100);
// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');
//验证token
$us_id = check_token($token);
// 获取当前用户的交易总记录
$total = get_log_balance_total($us_id);
// 交易记录数组
$rows = get_log_balance($us_id,$offset,$limit);
$new_row = array();

foreach ($rows as $row){
    $row["tx_amount"] = $row["tx_amount"] / get_la_base_unit();
    $row["credit_balance"] = $row["credit_balance"] / get_la_base_unit();
    $new_row[] = $row;
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $new_row;
$rtn_ary['total'] = $total;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
