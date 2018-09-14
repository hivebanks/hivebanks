<?php

require_once '../inc/common.php';
require_once 'db/us_base.php';
require_once 'db/us_bind.php';
require_once  'db/us_log_bind.php';
require_once  'db/log_ba_withdraw.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取用户当前订单信息 ==========================
GET参数
  token               用户TOKEN
返回
  order_list           订单详情
    qa_id                请求的id
    us_id                 用户id
    ba_id                 baid
    asset_id              资产id
    us_account_id         用户资产id
    bit_amount            数字货币资产
    base_amount            基础金额
    tx_hash                交易hash
    tx_type                交易类型
    tx_detail              交易明细
    tx_fee                 手续费
    tx_time                请求时间戳
    qa_flag                订单状态
说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 获取用户token
$token = get_arg_str('GET', 'token', 128);
//验证token
$us_id = check_token($token);

//获取当前订单信息
$order_list   = get_us_withdraw_order_list($us_id);
if(!$order_list){
    exit_error('101','订单信息获取失败');
}
$time_stamp =$order_list['0']['tx_time'];
$order_list['0']['tx_time'] = date("Y-m-d H:i:s",$time_stamp);
$detail = $order_list['0']['tx_detail'];
$array = json_decode($detail, true);
$order_list['0']['bit_address'] = $array['bit_address'];

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $order_list;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
