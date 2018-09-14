<?php

require_once '../inc/common.php';
require_once 'db/ba_asset_account.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 设定数字货币充值地址 ==========================
GET参数
  token           用户TOKEN
  offset          当前页
  limit           每页数据量
返回
  ba_id           用户id
  page_count      总数
  rows            返回数组
    bit_address   账号ID
    account_id    数字货币地址
    ctime         创建时间
    bind_flag     绑定标志，0为未使用，1为已使用
    bind_us_id    绑定用户
    utime         更新时间，即使用时间

说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

//当前页
$page_num = get_arg_str('GET', 'offset');
//每页数据量
$page_size = get_arg_str('GET', 'limit');
// 用户token
$token = get_arg_str('GET', 'token', 128);
//验证token
$ba_id = check_token($token);
//pagesize默认10，获取地址
$row = get_ba_asset_bit_account($ba_id, $page_size ? $page_size : 10,$page_num);

$new_rows = array();
foreach ($row as $for_row) {
    $new_row['bit_address'] = $for_row['bit_address'];
    $new_row['account_id'] = $for_row['account_id'];
    $new_row['ctime'] = $for_row['ctime'];
    $new_row['bind_flag'] = $for_row['bind_flag'];
    $new_row['bind_us_id'] = $for_row['bind_us_id'];
    $new_row['utime'] = date("Y-m-d H:i:s",$for_row['utime']);
    $new_rows[] = $new_row;
}

// 返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary["ba_id"] = $ba_id;
//总页数
$rtn_ary['page_count'] = count($row);;
$rtn_ary['rows'] = $new_rows ? $new_rows : [];
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
