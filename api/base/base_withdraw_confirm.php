<?php

require_once '../inc/common.php';
require_once 'db/base_withdraw_request.php';
require_once 'db/ba_base.php';
require_once "../inc/transaction_order/la_ba_withdraw_confirm.php";
require_once "../inc/transaction_order/la_ca_withdraw_confirm.php";
//require_once 'db/us_base.php';
//require_once 'db/com_base_balance.php';
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 提现请求确认 ==========================
GET参数
   token           用户TOKEN
   qa_id           请求ID
   type            type  1:同意，2：拒绝

返回
  errcode = 0     请求成功

说明
*/

php_begin();

$args = array('token','qa_id', 'type','transfer_tx_hash');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token',128);
// 请求id
$type = get_arg_str('GET','type');
$qa_id = get_arg_str('GET','qa_id');
$transfer_tx_hash = get_arg_str('GET','transfer_tx_hash');

$key = Config::TOKEN_KEY;
$des = new Des();
$decryption_code = $des -> decrypt($token, $key);
$now_time = time();
$code_conf =  explode(',',$decryption_code);
// 获取token中的需求信息
$ba_id = $code_conf[0];
$timestamp = $code_conf[1];
if($timestamp < $now_time){
    exit_error('114','Token timeout please retrieve!');
}

if ($type == '1') {
    $qa_flag = "1";
}elseif ($type == '2'){
    $qa_flag = "2";
}else {
    exit_error(1,"非法参数");
}

//根据qa_id获取订单信息
$rows = sel_withdraw_ba_base_amount_info($qa_id);
if (!$rows)
    exit_error('128',"该订单不存在");
if ($rows["qa_flag"] == 1)
    exit_error('129',"该订单已处理");
elseif ($rows["qa_flag"] == 2)
    exit_error('130',"该订单已拒绝");

//如果未处理，更新qa_flag==1/2

//成功，拒绝
if ($type == "2"){
    //返回用的base_amount,减去lock_amount
    if (!upd_refuse_us_base_amount_info($rows["us_id"],$rows["base_amount"],$rows["$base_amount"]))
        exit_error('101',"更新失败");
    exit_ok();
}
//成功，同意
//if (!$rows["base_amount"])
//    exit_error(1,"订单异常");
//获取ba基本用户信息

if ($rows["tx_type"] == "BA"){
    base_ba_withdraw_confirm($rows,$transfer_tx_hash);

}elseif ($rows["tx_type"] == "CA"){
    base_ca_withdraw_confirm($rows,$transfer_tx_hash);
}

$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['base_amount'] = get_ba_base_info($ba_id)["base_amount"];
$rtn_ary['lock_amount'] = get_ba_base_info($ba_id)["lock_amount"];
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
