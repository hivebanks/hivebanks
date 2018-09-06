<?php
require_once '../inc/common.php';
require_once 'db/us_base.php';
require_once 'db/us_bind.php';
require_once '../inc/judge_format.php';
require_once 'db/us_log_bind.php';
require_once "db/com_option_config.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户注册（手机） ==========================
GET参数
  country_code    国家代码
  cellphone       手机号码
  pass_word       原始密码
  pass_word_hash  密码HASH
  sms_code        短信验证码
  invit_code      邀请码(指数增长链 TODO)

返回
  errcode = 0     请求成功

说明
  手机注册流程
  C端用户输入国家代码，手机号码点击获取短信验证码按钮，调用请求手机验证API
  C端用户检查手机短信获取并输入验证码（4位或6位数字）
  C端判定密码强度，重复密码是否正确，然后将国家代码，手机号码，验证码，密码，重复密码的HASH值提交S端。
  
  ========================== 输入数据检查 ==========================
  S端判定国家代码，手机号码是否有效
  S端判定原始密码强度是否正确
  S端判定原始密码的HASH值是否正确
  
  ========================== 账户存在检查 ==========================
  S端从us_bind表取得满足以下条件的最新数据(utime最大)：
    bind_type = 'text'
    AND bind_name = 'cellphone'
    AND bind_info = 国家代码+'-'+手机号码

  若数据不存在返回 无该手机号码的验证信息
  若数据存在且 flag = 9(已注销) 视为数据不存在
  若数据存在且 flag = 1(新建) 返回该手机号码已经注册

  ========================== 手机验证检查 ==========================
  若数据存在且 flag = 0(待确认) 
  判断验证码是否正确（bind_id第二段4个字符转10进制）
  若验证码错误，返回 错误的验证码。

  ========================== 用户注册处理 ==========================
  若验证码正确创建两条用户绑定信息
  一：手机绑定信息
  绑定数据的us_id
  bind_type = 'text'
  bind_name = 'cellphone'
  bind_info = 国家代码+'-'+手机号码
  flag = 1(新建)
  二：登录密码绑定信息
  绑定数据的us_id
  bind_type = 'hash'
  bind_name = 'password_login'
  bind_info = 密码HASH
  flag = 0(待确认)
  
  以上操作有失败返回 系统异常，请稍后再试
  以上操作均成功返回
  errcode = 0     请求成功
  
*/

php_begin();
$args = array('country_code', 'cellphone','pass_word_hash', 'sms_code','pass_word');
chk_empty_args('GET', $args);

// 国家代码
$country_code   = get_arg_str('GET', 'country_code');
// 手机号码
$cellphone      = get_arg_str('GET', 'cellphone');
// 密码
// 密码HASH
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');
// 验证码
$sms_code       = get_arg_str('GET', 'sms_code');
// 邀请码
$invit_code     = get_arg_str('GET', 'invit_code');
//原始密码
$pass_word      = get_arg_str('GET', 'pass_word');

// 用户基本信息
$data_base = array();
// 用户绑定信息
$data_bind = array();
// 密码绑定信息
$data_bind_pass = array();
// 创建用户us_id
$us_id =get_guid();

// 判断是否为手机号
$is_phone = isPhone($cellphone);
if(!$is_phone){
    exit_error('100','The input format is incorrect');
}

//判断密码强度
$score = Determine_password_strength($pass_word);

if($score <= 3){
   exit_error('119','密码过于简单请重新设置!');
}
if(us_can_reg_or_not()["option_value"] != 1)
    exit_error("121","当前la未开通注册");

$variable= 'cellphone';
$variable_code = 'phone_code';
$cellphone_num = $country_code .'-'.$cellphone;
// 获取最新的创建记录
$row = get_us_id_by_variable($variable,$cellphone_num);
// 获取绑定信息日志表该用户最新的数据
$rec = get_us_log_bind_by_variable($variable_code , $cellphone_num);
if(!$rec){
    exit_error('113','无匹配的认证信息');
}
// 基本信息参数整理
$data_base['us_id'] = $us_id;

// 绑定手机信息整理
$data_bind['bind_id'] = get_guid();
$data_bind['us_id'] = $us_id;
$data_bind['bind_name'] = 'cellphone';
$data_bind['bind_info'] = $cellphone_num;
$data_bind['bind_flag'] = 1;
$data_bind['bind_type'] = 'text';

// 绑定登录密码参数整理
$data_bind_pass = array();
$data_bind_pass['bind_id'] = get_guid();
$data_bind_pass['us_id'] =$us_id;
$data_bind_pass['bind_type']  = 'hash';
$data_bind_pass['bind_name'] = 'password_login';
$data_bind_pass['bind_info'] = $pass_word_hash;
$data_bind_pass['bind_flag'] = 1;
// 手机号码地址已经存在
if($row['us_id']){
  // 是否注册验证完成
  switch ($row['bind_flag'])
  {
    case 1:
      exit_error('105 ','Registered users please login directly!');
      break;
    case 9:
       break;
  }
}
$timestamp = time();
//判断是否可以验证
if($rec['limt_time'] > $timestamp && $rec['count_error'] != 0){
    exit_error('116',$rec['limt_time'] - $timestamp);
}
if($rec){
    // 绑定参数设定
    $data_log_bind = $rec;
    $data_log_bind['count_error'] = $rec['count_error']+1;
    $data_log_bind['limt_time'] = $timestamp + pow(2,$data_log_bind['count_error']);
    unset($data_log_bind['log_id']);
}

//超时判断
if((strtotime($rec['ctime']) + 15*60) < $timestamp){
    $phone_used = upd_us_phone_log_bind_info($rec['us_id']);
    exit_error('111','信息过期，请重试！');
}
if(empty($rec) ||$rec['bind_salt'] != $sms_code || $rec['bind_info']!= $cellphone_num)
    exit_error('110','验证码信息不正确');
if(($rec['limt_time'] + 29*60) < $timestamp){
    exit_error("111","验证超时");
}

//绑定信息写入数据库
$data_base['us_account'] = "hivebanks_".$cellphone;
$ret = ins_base_user_reg_base_info($data_base);
$bind_phone = ins_bind_user_reg_bind_info($data_bind);
$bind_pass = ins_bind_user_reg_bind_info($data_bind_pass);
//已使用的验证码消除使用权限
$userd_salt =  upd_us_log_bind_variable($variable_code , $cellphone_num);
if(!$userd_salt){
    exit_error('101','验证码被修改');
}

// 判断用户绑定信息和用户基本信息是否都写入成功
if($ret && $bind_phone && $bind_pass)
{
  exit_ok();
}else{
  exit_error();
}
