<?php

require_once '../inc/common.php';
require_once 'db/us_ba_recharge_request.php';
require_once 'db/us_base.php';
require_once 'db/ba_base.php';
require_once 'db/com_base_balance.php';
require_once('../inc/mysql.php');
require_once "../inc/transaction_order/ba_recharge_confirm.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 充值请求确认 ==========================
GET参数
   token           用户TOKEN
   qa_id           请求ID
   type            type  1:同意，2：拒绝
返回
  errcode = 0     请求成功
说明
*/

php_begin();
$args = array('token','qa_id', 'type');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
// 请求id
$type = get_arg_str('GET','type');
$qa_id = get_arg_str('GET','qa_id');
//验证token
$ba_id = check_token($token);

if ($type == '1') {
    $qa_flag = "1";
}elseif ($type == '2'){
    $qa_flag = "2";
}else {
    exit_error(1,"非法参数");
}
//根据qa_id获取订单信息
$rows = sel_recharge_ba_base_amount_info($qa_id);
if (!$rows)
    exit_error(1,"该订单不存在");
if ($rows["qa_flag"] == 1)
    exit_error(1,"该订单已处理");
elseif ($rows["qa_flag"] == 2)
    exit_error(1,"该订单已拒绝");

if ($type == "2"){
    //返回用的base_amount,减去lock_amount
    if (!upd_refuse_ba_base_amount_info($rows["ba_id"],$rows["base_amount"],$rows["$base_amount"]))
        exit_error('101',"更新失败");
    exit_ok();
}
recharge_confirm($rows);
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['base_amount'] = get_ba_base_info($ba_id)["base_amount"] / BASE_UNIT;
$rtn_ary['lock_amount'] = get_ba_base_info($ba_id)["lock_amount"] / BASE_UNIT;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
