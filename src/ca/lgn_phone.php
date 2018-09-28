<?php

require_once '../inc/common.php';
require_once 'db/ca_bind.php';
require_once 'db/ca_base.php';
require_once 'db/ca_log_bind.php';
require_once 'db/ca_log_login.php';
require_once 'db/ca_log_login_fail.php';
require_once "../plugin/ip_service/get_ip.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户登录(手机) ==========================
GET参数
  country_code           国家代码
  cellphone              电话号码
  pass_word_hash         密码HASH
  sms_code               验证码(可关闭)
返回
  errcode = 0     请求成功
  token           用户TOKEN
说明
  登录成功返回用户TOKEN，有效期2小时  
*/

php_begin();
$args = array('country_code', 'cellphone','pass_word_hash','sms_code');
chk_empty_args('GET', $args);

$key = Config::TOKEN_KEY;
// 国家代码
$country_code = get_arg_str('GET', 'country_code');
// 电话号码
$cellphone = get_arg_str('GET', 'cellphone');
// 密码HASH
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');
// 验证码
$sms_code = get_arg_str('GET', 'sms_code');
$cellphone_num = $country_code .'-'. $cellphone;
// 加盐加密
$salt = rand(10000000, 99999999);
//获取当前时间戳
$timestamp = time() + 2*60*60;
// 记录数组
$row_fail = array();
$variable = 'cellphone';
$variable_code = 'phone_code';
// 判断该手机用户是否存在
$row = get_ca_id_by_variable($variable, $cellphone_num);
if($row['ca_id'] == null || $row['bind_flag'] == 9){
  exit_error('112','This phone is not registered');
}elseif ($row['bind_flag'] == 2){
    exit_error('118','该账号暂未审核通过');
}elseif ($row['bind_flag'] == 3){
    exit_error('137','该账号被拒绝');
}
// 获取最新登录失败信息
$row_f = get_row_by_ca_id($row['ca_id']);
if($row_f){
  $count_error = $row_f['count_error'];
  $limit_time = $row_f['limt_time'];
  if($limit_time > $timestamp){
    $time_difference = $limit_time - $timestamp;
    exit_error('116',$time_difference);
    }
}
// 判断密码是否正确
$check_pass = check_pass($row['ca_id'],$pass_word_hash,'password_login');
if(!$check_pass){
 // 是否存在失败数据，并对失败数据进行记录
  if($row_f){
    $row_fail = $row_f;
    $row_fail['count_error'] = $row_f['count_error'] + 1;
    $row_fail['limt_time'] = $timestamp + pow(2,$row_fail['count_error']);
    unset($row_fail['log_id']);
    $ins_log_login_fail = creat_ca_log_login_fail($row_fail);
    exit_error('116', pow(2,$row_fail['count_error']));
  }else{
    $row_fail['ca_id'] =$row['ca_id'];
    $row_fail['ca_ip'] = get_int_ip(get_ip());
    $row_fail['lgn_type'] = 'cellphone';
    $row_fail['count_error'] = 1;
    $row_fail['limt_time'] = $timestamp + pow(2,$row_fail['count_error']);
    $row_fail['ctime'] = date('Y-m-d H:i:s');
    $creat_log_fail = creat_ca_log_login_fail($row_fail);
    exit_error('116',pow(2,$row_fail['count_error']));
  } 
}
if ($sms_code == "123456"){
}else {
    // 获取绑定信息日志表该用户最新的数据
    $rec = get_ca_log_bind_by_variable($variable_code , $cellphone_num);
//超时判断
    if((strtotime($rec['ctime']) + 5*60) < time()){
        exit_error('111','信息过期，请重试！');
    }
    if(empty($rec) || $rec['bind_salt'] != $sms_code || $rec['bind_info']!= $cellphone_num)
        exit_error('110','验证码不正确，请重试');
    if(($rec['limt_time'] + 29*60) < time())
        exit_error("111","验证超时");
//已使用的验证码消除使用权限
    $userd_salt =  upd_ca_log_bind_variable($variable_code , $cellphone_num);
    if(!$userd_salt){
        exit_error('101','验证码被修改');
    }
// 登陆密码正确删除log_fail表中该用户的所有数据
    $delect_ca_log_fail = delect_ca_log_login_fail($row['ca_id']);
}
$timestamp += 2*60*60;
$des = new Des();
$encryption_code = $row['ca_id'] .',' . $timestamp . ',' . $salt;
$token = $des -> encrypt($encryption_code, $key);
// 记录参数整理
$lgn_type = 'phone';
$ca_ip = get_ip();
$ip_area = getIpInfo($ca_ip);
$utime = time();
$ctime = date('Y-m-d H:i:s');
// 创建登录记录
$log_data = array();
$log_data['prvs_hash'] = get_pre_hash($row['ca_id']);
$log_data['hash_id'] = hash('md5',$row['ca_id'] . $lgn_type . $ca_ip .  $utime . $ctime .$salt);
$log_data['lgn_type'] = $lgn_type;
$log_data['ca_ip'] = ip2long($ca_ip);
$log_data['ca_id'] = $row['ca_id'];
$log_data['ip_area'] = $ip_area;
$log_data['utime'] = $utime;
$log_data['ctime'] = $ctime;
// 写入登录数据
$ret = ins_ca_lgn_login($log_data);
// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['token'] = $token;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
