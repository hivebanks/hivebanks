<?php

require_once '../inc/common.php';
require_once 'db/us_base.php';
require_once 'db/us_bind.php';
require_once 'db/us_log_bind.php';
require_once 'db/us_log_login.php';
require_once 'db/us_log_login_fail.php';
require_once "../plugin/ip_service/get_ip.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户登录(手机) ==========================
GET参数
  country_code           国家代码
  cellphone              电话号码
  pass_word_hash         密码HASH
  cfm_code               验证码(可关闭)
  sms_code        短信验证码登录（TODO）
返回
  errcode = 0     请求成功
  token           用户TOKEN
说明
  登录成功返回用户TOKEN，有效期2小时  
*/

php_begin();
$args = array('country_code', 'cellphone','pass_word_hash');
chk_empty_args('GET', $args);

$key = Config::TOKEN_KEY;
// 国家代码
$country_code = get_arg_str('GET', 'country_code');
// 电话号码
$cellphone = get_arg_str('GET', 'cellphone');
// 密码HASH
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');

$cellphone_num = $country_code .'-'. $cellphone;
// 加盐加密
$salt = rand(10000000, 99999999); 

//获取当前时间戳
$now_time = time();
$timestamp = time() + 2*60*60;
// 记录数组
$row_fail = array();
$variable = 'cellphone';
$variable_code = 'phone_code';
$pass = 'password_login';
// 判断该手机用户是否存在
$row = get_us_id_by_variable($variable,$cellphone_num);

if(empty($row['us_id']) || $row['bind_flag'] == 9){
  exit_error('112','This phone is not registered');
}elseif ($row['bind_flag'] == 2){
    exit_error('118','该账号暂未审核通过');
}elseif ($row['bind_flag'] == 3){
    exit_error('137','该账号被拒绝');
}

// 获取最新登录失败信息
$row_f = get_row_by_us_id($row['us_id']);
if($row_f){
  $count_error = $row_f['count_error'];
  $limit_time = $row_f['limit_time'];
  if($limit_time > $timestamp){
    $time_difference = $limit_time - $timestamp;
    exit_error('122',$time_difference);
    }
}

// 判断密码是否正确
$check_pass = checkc_pass($row['us_id'],$pass_word_hash,$pass);
if(!$check_pass){
 // 是否存在失败数据，并对失败数据进行记录
  if($row_f){
    $row_fail = $row_f;
    $row_fail['count_error'] = $row_f['count_error'] + 1;
    $row_fail['limt_time'] = $timestamp + pow(2,$row_fail['count_error']);
    unset($row_fail['log_id']);
    $ins_log_login_fail = creat_us_log_login_fail($row_fail);
    exit_error('116', pow(2,$row_fail['count_error']));
  }else{
    $row_fail['us_id'] =$row['us_id'];
    $row_fail['us_ip'] = get_int_ip(get_ip());
    $row_fail['lgn_type'] = 'phone_code';
    $row_fail['count_error'] = 1;
    $row_fail['limt_time'] = $timestamp + pow(2,$row_fail['count_error']);
    $row_fail['ctime'] = date('Y-m-d h:i:s');
    $creat_log_fail = creat_us_log_login_fail($row_fail);
    exit_error('116',pow(2,$row_fail['count_error']));
  } 
}

$timestamp += 2*60*60;
$des = new Des();
$encryption_code = $row['us_id'] .',' . $timestamp . ',' . $salt;
$token = $des -> encrypt($encryption_code, $key);
// 记录参数整理
$lgn_type = 'phone';
$us_ip = get_ip();
$ip_area = getIpInfo($us_ip);
$utime = time();
$ctime = date('Y-m-d H:i:s');
// 创建登录记录
$log_data = array();
$log_data['prvs_hash'] = get_pre_hash($row['us_id']);
$log_data['hash_id'] = hash('md5',$row['us_id'] . $lgn_type . $us_ip .  $utime . $ctime .$salt);
$log_data['lgn_type'] = $lgn_type;
$log_data['us_ip'] = ip2long($us_ip);
$log_data['us_id'] = $row['us_id'];
$log_data['ip_area'] = $ip_area;
$log_data['utime'] = $utime;
$log_data['ctime'] = $ctime;
// 写入登录数据
$ret = ins_us_lgn_login($log_data);
// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['token'] = $token;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
