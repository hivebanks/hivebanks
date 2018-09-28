<?php

require_once '../inc/common.php';
require_once '../inc/judge_format.php';
require_once 'db/us_bind.php';
require_once 'db/us_base.php';
require_once  'db/us_asset_cash_account.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户法定货币外部账号绑定 ==========================
GET参数
  token                  用户TOKEN
  cash_type              法币类型
  cash_channel           法定货币渠道
  cash_address           法币账户
  name                   姓名
  idNUM                  身份证号
  pass_word_hash         密码hash

返回
  errcode = 0     请求成功

说明
  同一类型下的地址是唯一的
*/
php_begin();
$args = array('token', 'cash_type', 'cash_address','name','idNum','pass_word_hash');
chk_empty_args('GET', $args);

// 用户TOKEN
$token = get_arg_str('GET', 'token',128);
// 法定货币类型
$cash_type = get_arg_str('GET', 'cash_type',255);
// 法定货币外部账号
$lgl_address = get_arg_str('GET', 'cash_address', 255);
// 姓名
$name = get_arg_str('GET', 'name');
// 身份证号
$idNum = get_arg_str('GET', 'idNum',128);
// 外部资产货币渠道
$cash_channel = get_arg_str('GET', 'cash_channel');
// 密码hash
$pass_word_hash =  get_arg_str('GET', 'pass_word_hash');
//验证token
$us_id = check_token($token);

//判断身份证号是否正确
if(!is_idcard($idNum)){
 exit_error('100','身份证号格式不正确');
}
$pass_word_login = 'password_login';
// 获取pass_word_hash
$get_pass_word_hash = get_pass_word_hash($us_id,$pass_word_login);

if($pass_word_hash != $get_pass_word_hash){
    exit_error('102','Authentication password failed');
}

if(!check_bankCard($lgl_address)){
    exit_error('100','Information entry or update failed');
}
$row_fail = array();
//根据us_id获取基本信息
$row = get_us_base_info_by_token($us_id);
$data_recharge_pass = array();
//整理插入db数据
$lgl_addressArr = array();
$lgl_addressArr["lgl_address"] = $lgl_address;
$lgl_addressArr["name"] = $name;
$lgl_addressArr['idNum'] = $idNum;
$lgl_addressArr['cash_type'] = $cash_type;
$lgn_type = 'account';
$utime = time().rand(1000, 9999);
$ctime = date('Y-m-d H:i:s');
$us_ip = get_ip();

$data_bind_pass['account_id'] = hash('md5',$us_id . $lgn_type . $us_ip .  $utime . $ctime);
$data_bind_pass['us_id'] = $us_id;
$data_bind_pass['cash_channel'] = $cash_channel;
$data_bind_pass['lgl_address'] = json_encode($lgl_addressArr,JSON_UNESCAPED_UNICODE);
$data_bind_pass['bind_flag'] = "0";
$data_bind_pass['cash_type'] = $cash_type;
$data_bind_pass['ctime'] = date("Y-m-d H:i:s");
$data_bind_pass['utime'] = time();

if(sel_us_asset_account_info($us_id,$lgl_address))
    exit_error('103',"User add account address duplicate");
//如果不存在，插入db
$us_row = ins_us_asset_account_info($data_bind_pass);
if (!$us_row) {
    exit_error('101',"Information entry or update failed");
}
//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
