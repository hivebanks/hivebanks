<?php

require_once '../inc/common.php';
require_once '../inc/judge_format.php';
require_once 'db/us_bind.php';
require_once 'db/us_base.php';
require_once  'db/us_asset_bit_account.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户数字货币外部账号绑定 ==========================
GET参数
  token                 用户TOKEN
  bit_type              法币类型
  bit_address           法币账户
  pass_word_hash        密码hash

返回
  errcode = 0     请求成功

说明
  同一类型下的地址是唯一的
*/
php_begin();
$args = array('token', 'bit_type', 'bit_address','pass_word_hash');
chk_empty_args('GET', $args);

// 用户TOKEN
$token = get_arg_str('GET', 'token',128);
// 数字货币类型
$bit_type = get_arg_str('GET', 'bit_type',255);
// 数字货币外部账号
$bit_address = get_arg_str('GET', 'bit_address', 255);
// 密码hash
$pass_word_hash =  get_arg_str('GET', 'pass_word_hash');
//验证token
$us_id = check_token($token);

$pass_word_login = 'password_login';
// 获取pass_word_hash
$get_pass_word_hash = get_pass_word_hash($us_id,$pass_word_login);

if($pass_word_hash != $get_pass_word_hash){
    exit_error('102','Authentication password failed');
}
$row_fail = array();
//根据us_id获取基本信息
$row = get_us_base_info_by_token($us_id);
$data_recharge_pass = array();
//整理插入db数据

$lgn_type = 'bit';
$utime = time().rand(1000, 9999);
$ctime = date('Y-m-d H:i:s');
$us_ip = get_ip();
//数字货币地址绑定
$data_bind_pass['account_id'] = hash('md5',$us_id . $lgn_type . $us_ip .  $utime . $ctime);
$data_bind_pass['us_id'] = $us_id;
$data_bind_pass['bit_type'] = $bit_type;
$data_bind_pass['bit_address'] = $bit_address;
$data_bind_pass['ctime'] = date("Y-m-d H:i:s");
$data_bind_pass['utime'] = time();

$rows = sel_us_asset_bit_account_info($us_id);
foreach ($rows as $row){
    if($row['bit_address'] == $bit_address){
        exit_error('103',"User add account address duplicate");
    }
}

//如果不存在，插入db
$us_row = ins_us_asset_bit_account_info($data_bind_pass);
if (!$us_row) {
    exit_error('101',"Information entry or update failed");
}
//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $bit_address;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
