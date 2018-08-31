<?php
require_once '../inc/common.php';
require_once 'db/log_ba_withdraw.php';
require_once 'db/us_base.php';
require_once "db/la_base.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 数字货币提现记录查询 ==========================
GET参数
  token                用户TOKEN
  limit                分页记录
  offset               分页偏移量
  type                 查询类型
返回
  total                总记录数
  rows                 记录数组
   ba_id               BA ID
   us_id               US ID
   asset_id            充值资产id
   ba_account_id       代理商账户id
   bit_amount          数字货币金额
   base_amount         充值资产金额
   credit_balance      变动后账户余额
   tx_hash             交易hash
   tx_detail           交易明细
   tx_time             交易时间戳
   tx_fee              交易汇率
说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);
// 用户token
$token = get_arg_str('GET', 'token',128);
// 查询类型
$type = get_arg_str('GET', 'type');
// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');
//验证token
$us_id = check_token($token);

$vail = 'us_in';
if($type ==''){
    $type = 1;
}

//用户信息
$us_info = get_us_base_info_by_token($us_id);
if(!$us_info)
    exit_error('101','get user info error');

$total = get_us_ba_withdraw_total_by_us_id($us_id,$type);
// 记录数组
$rows = get_us_ba_withdraw_rows($us_id,$limit, $offset,$type);
$new_rows = array();
foreach ($rows as $row){
    $new_row["tx_time"] = date('Y-m-d H:i', $row["tx_time"]);
    $new_row["asset_id"] = $row["asset_id"];
    $new_row["base_amount"] = $row["base_amount"] /  get_la_base_unit();
    $data = json_decode($row["tx_detail"],true);
    $new_row["transfer_tx_hash"] = $data["transfer_tx_hash"];
    $new_rows[] = $new_row;
}
// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['total'] = $total;
$rtn_ary['rows'] = array_reverse($new_rows);
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
