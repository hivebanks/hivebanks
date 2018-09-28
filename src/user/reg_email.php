<?php

require_once '../inc/common.php';
require_once 'db/us_base.php';
require_once 'db/us_bind.php';

require_once '../inc/judge_format.php';
require_once 'db/us_log_bind.php';
require_once "db/com_option_config.php";
//require_once "db/us_invite.php";
require_once "../inc/common_agent_email_service.php";
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户注册（邮件） ==========================
GET参数
  email           Email地址
  pass_word       原始密码
  pass_word_hash  密码HASH
  cfm_code        验证码(防暴力注册 TODO)
  invit_code      邀请码(指数增长链 TODO)
返回
  errcode = 0     请求成功
说明
  邮件注册流程
  C端用户输入Email地址，密码和重复密码后
  C端判定密码强度，重复密码是否正确，然后将密码，重复密码的HASH值提交S端。

  ========================== 输入数据检查 ==========================
  S端判定Email地址是否有效
  S端判定原始密码强度是否正确
  S端判定原始密码的HASH值是否正确

  ========================== 账户存在检查 ==========================
  S端从us_bind表取得满足以下条件的最新数据(utime最大)：
    bind_type = 'text'
    AND bind_name = 'email'
    AND bind_info = Email地址

  若数据存在且 flag = 1(新建) 返回该Email地址已经注册
  若数据存在且 flag = 0(待确认) 若创建时间在24小时以内

  创建新的us_id
  创建用户绑定信息
  us_id = 之前创建的us_id
  bind_type = 'text'
  bind_name = 'email'
  bind_info = Email地址
  flag = 0(待确认)

  调用请求邮箱验证API，向该邮箱再次发送验证邮件。
  若发送失败，返回注册确认邮件发送失败，请稍后再试。
  成功发送后返回注册确认邮件已发送，请确认。

  ========================== 验证邮件发送 ==========================
  若数据存在且 flag = 9(已注销) 视为不存在
  若不存在
  调用请求邮箱验证API，向该邮箱发送验证邮件。
  若发送失败，返回注册确认邮件发送失败，请稍后再试。

  ========================== 用户注册处理 ==========================
  创建登录密码绑定信息
  us_id = 之前创建的us_id
  bind_type = 'hash'
  bind_name = 'password_login'
  bind_info = 密码HASH
  flag = 0(待确认)

  以上操作有失败返回 系统异常，请稍后再试
  以上操作均成功返回
  errcode = 0     请求成功

*/


php_begin();
$args = array('email', 'pass_word_hash', 'pass_word');
chk_empty_args('GET', $args);


// Email地址
$email = get_arg_str('GET', 'email', 255);
// 邀请码
$invit_code = get_arg_str('GET', 'invit_code');
// 密码HASH
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');
// 原始密码
$pass_word = get_arg_str('GET', 'pass_word');
// 验证码
$cfm_code = get_arg_str('GET', 'cfm_code');
$is_email = isEmail($email);
if (!$is_email) {
    exit_error('109', 'Email format not correct!');
}
//判断密码强度
$score = Determine_password_strength($pass_word);
if ($score <= 3) {
    exit_error('119', '密码过于简单请重新设置!');
}
if (us_can_reg_or_not()["option_value"] != 1)
    exit_error("120", "当前la未开通注册");


// 用户基本信息数组
$data_base = array();

if($invit_code) {
    $icc = invite_code_check($invit_code);
    if (!$icc)
        exit_error('215', '邀请码错误');
    $data_base['invite_code'] = $invit_code;
}

// 创建用户us_id
$us_id = get_guid();
// 创建用户bind_id
$bind_id = get_guid();
// 用户绑定信息数组
$data_log_bind = array();
$variable = 'email';
// 当前时间戳
$timestamp = time();
// 判断邮箱是否已存在
$row = get_us_id_by_variable($variable, $email);
// 获取绑定信息日志表该用户最新的数据
$teltime = 1;
$rec = get_us_log_bind_by_variable($variable, $email);
if (!$rec) {
    $teltime = 0;
}
if ($teltime != 0) {
    $teltime = strtotime($rec['ctime']) + 15 * 60;
    if ($teltime > $timestamp) {
        //判断是否可以进行注册
        if ($rec && $rec['bind_info'] == $email) {
            exit_error('121', '待确认，请前往邮箱验证');
        }
    } else {
        //把本次的绑定的数据进行无效操作
        $email_used = upd_us_log_bind_info($us_id);
    }
}
 $teltime = strtotime($rec['ctime']) +15*60 ;
if($teltime > $timestamp ){
    //判断是否可以进行注册
    if($rec && $rec['bind_info'] == $email){
        exit_error('121','待确认，请前往邮箱验证');
    }
}else{
    //把本次的绑定的数据进行无效操作
    $email_used = upd_us_log_bind_info($us_id);
}

// 基本信息参数设定
$data_base['us_id'] = $us_id;


// 绑定参数设定
$data_log_bind['us_id'] = $us_id;
$data_log_bind['bind_info'] = $email;
$data_log_bind['bind_name'] = 'email';
$data_log_bind['bind_type'] = 'text';


// 绑定登录密码参数整理
$data_bind_pass = array();
$data_bind_pass['bind_id'] = get_guid();
$data_bind_pass['us_id'] = $us_id;
$data_bind_pass['bind_type'] = 'hash';
$data_bind_pass['bind_name'] = 'password_login';
$data_bind_pass['bind_info'] = $pass_word_hash;
$data_bind_pass['bind_flag'] = 1;

// 加盐加密
$salt = rand(10000000, 99999999);
// 邮件地址已经存在
if ($row['us_id']) {
    //是否注册验证完成
    switch ($row['bind_flag']) {
        case 1:
            exit_error('105', 'Registered users please login directly!');
            break;
        case 9:
            break;
    }
}

//判断是否可以验证
if ($rec['limt_time'] > $timestamp) {
    exit_error('116', $rec['limt_time'] - $timestamp);
}
if ($rec) {
    // 绑定参数设定
    $data_log_bind = $rec;
    $data_log_bind['count_error'] = $rec['count_error'] + 1;
    $data_log_bind['limt_time'] = $timestamp + pow(2, $data_log_bind['count_error']);
    unset($data_log_bind['log_id']);
}
$key = Config::TOKEN_KEY;
$data_base['us_account'] = "hivebanks_" . $email;
//$bind_email = ins_bind_user_reg_bind_log($data_log_bind);

$url = Config::CONFORM_URL;

//绑定成功发送验证信息
//if($bind_email){
$timestamp += 15 * 60;
$title = '邮箱验证链接';
$des = new Des();
$body ="<h3>亲爱的用户：</h3>当您收到这封邮件时，说明您的注册邮箱是有效的。
<br>邮箱通过有效验证后，您的账户安全将更有保障。
<br>点击此处激活账户 , 如果链接无法点击，请复制并打开以下网址：<br>
<br>". $url . "?cfm_hash=";
$encryption_code = $us_id . ',' . $email . ',' . $timestamp . ',' . $salt;
$body .=  urlencode($des->encrypt($encryption_code, $key))."
<br>
<h3>安全提示</h3>
<span>*不要把您的密码以及本链接告诉任何人！</span><br>
<span>*开启二次验证（谷歌验证或短信验证)！</span><br>
<span>如果此活动不是您本人操作，请您尽快联系客服人员。 </span><br>
<span>此为系统邮件，请勿回复
请保管好您的邮箱，避免账号被他人盗用</span>
";
require_once "db/la_admin.php";
$key_code = get_la_admin_info()["key_code"];

$output_array = send_email_by_agent_service($email,$title,$body,$key_code);

//print_r($output_array);

if($output_array["errcode"] == "0"){
    $bind_email = ins_bind_user_reg_bind_log($data_log_bind);
    $ret = ins_base_user_reg_base_info($data_base);
    $bind_pass = ins_bind_user_reg_bind_info($data_bind_pass);
    if ($bind_email && $ret && $bind_pass) {
        exit_ok('Please verify email as soon as possible!');
    } else {
        exit_error('101', 'Create failed! Please try again!');
    }


}else{
    exit_error('124', '邮件发送失败请稍后重试！');
}
