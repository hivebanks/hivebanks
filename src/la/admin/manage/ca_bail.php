<?php

require_once "../../../inc/common.php";
require_once "../../../ba/db/la_base.php";
require_once "db/ca_base.php";
require_once "db/la_admin.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 调整ca保证金 ==========================
GET参数
token                   用户token
pass_word_hash          pass_word_hash
base_amount             base_amount
ba_id                   ba_id
返回
rows            信息数组
      base_amount        保证金余额
说明
*/

php_begin();
$args = array('token','ca_id','base_amount','pass_word_hash');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
$ca_id = get_arg_str('GET', 'ca_id', 128);
$base_amount = get_arg_str('GET', 'base_amount' , 99);
$password = get_arg_str('GET', 'pass_word_hash', 99);

//la用户检查
$user_id = la_user_check($token);
password_check($user_id,$password);
if($base_amount<=0)
    exit_error('123','充值金额错误');
//获取ca基本信息
$rows = get_ca_base_info_by_ca_id($ca_id);
if(!$rows)
    exit_error('101','没有该ca记录');
//获取汇率
$base_unit = get_la_base_unit();
$base_amount = $base_unit * $base_amount;
$res = update_ca_bail($ca_id,$base_amount);
if (!$res)
    exit_error("101","更改保证金失败");
$base_amount = $base_amount/$base_unit;
//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = array('base_amount'=>$base_amount);
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
