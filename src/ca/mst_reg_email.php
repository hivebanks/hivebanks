<?php

require_once '../inc/common.php';
require_once "../inc/common_agent_email_service.php";
require_once 'db/ca_base.php';
require_once 'db/ca_bind.php';
require_once '../inc/judge_format.php';
require_once 'db/ca_log_bind.php';
require_once "db/com_option_config.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 代理商注册（邮件） ==========================
GET参数
  email           Email地址
  pass_word_hash  密码HASH
  pass_word       原始密码
返回
  errcode = 0     请求成功
说明
  会调用send_email给注册邮箱发送验证链接，有效时间15分钟
*/

php_begin();
$args = array('email', 'pass_word_hash');
chk_empty_args('GET', $args);

// Email地址
$email = get_arg_str('GET', 'email', 255);
// 密码
//$pass_word = get_arg_str('GET', 'pass_word');
// 密码HASH
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');
$is_email = isEmail($email);
if (!$is_email) {
    exit_error('100', 'Email format not correct!');
}
if (ca_can_reg_or_not()["option_value"] != 1)
    exit_error("120", "当前la未开通注册");

//判断密码强度

//$score = Determine_password_strength($pass_word);

//if($score <= 3){
//    exit_error('10','密码过于简单请重新设置!');
//}

// 创建用户ca_id
$ca_id = get_guid();
// 创建用户bind_id
$bind_id = get_guid();
// 用户基本信息数组
$data_base = array();
// 用户绑定信息数组
$data_log_bind = array();
$variable = 'email';
// 当前时间戳
$timestamp = time();
// 判断邮箱是否已存在
$row = get_ca_id_by_variable($variable, $email);
$teltime = 1;
// 获取绑定信息日志表该用户最新的数据
$rec = get_ca_log_bind_by_variable($variable, $email);
if (!$rec) {
    $teltime = 0;
}
$teltime = strtotime($rec['ctime']) + 15 * 60;
if ($teltime > $timestamp) {
    //判断是否可以进行注册
    if ($rec && $rec['bind_info'] == $email) {
        exit_error('121', '待确认，请前往邮箱验证');
    }
} else {
    //把本次的绑定的数据进行无效操作
    $email_used = upd_ca_log_bind_info($ca_id);
}

// 基本信息参数设定
$data_base['ca_id'] = $ca_id;

// 绑定参数设定
$data_log_bind['ca_id'] = $ca_id;
$data_log_bind['bind_info'] = $email;
$data_log_bind['bind_name'] = 'email';
$data_log_bind['bind_type'] = 'text';


// 绑定登录密码参数整理
$data_bind_pass = array();
$data_bind_pass['bind_id'] = get_guid();
$data_bind_pass['ca_id'] = $ca_id;
$data_bind_pass['bind_type'] = 'hash';
$data_bind_pass['bind_name'] = 'password_login';
$data_bind_pass['bind_info'] = $pass_word_hash;
$data_bind_pass['bind_flag'] = 1;
$data_base['ca_id'] = $ca_id;
//加盐加密
$salt = rand(10000000, 99999999);
// 邮件地址已经存在
if ($row) {
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
$data_base['base_amount'] = 0;
$data_base['lock_amount'] = 0;
$data_base['ca_level'] = 0;
$data_base['security_level'] = 2;
$data_base['utime'] = time();
$data_base['ca_account'] = "hivebanks_" . $email;
$data_base['ctime'] = date("Y-m-d H:i:s");

$url = Config::CA_CONFORM_URL;
//绑定成功发送验证信息
//if($bind_email){
$timestamp += 15 * 60;
$title = '邮箱验证链接';
$des = new Des();

$body ="<h3>亲爱的用户：</h3>当您收到这封邮件时，说明您的注册邮箱是有效的。
<br>邮箱通过有效验证后，您的账户安全将更有保障。
<br>点击此处激活账户 , 如果链接无法点击，请复制并打开以下网址：<br>
<br>". $url . "?cfm_hash=";
$encryption_code = $ca_id . ',' . $email . ',' . $timestamp . ',' . $salt;
$body .=  urlencode($des->encrypt($encryption_code, $key))."
<br>
<h3>安全提示</h3>
<span>*不要把您的密码以及本链接告诉任何人！</span><br>
<span>*开启二次验证（谷歌验证或短信验证)！</span><br>
<span>如果此活动不是您本人操作，请您尽快联系客服人员。 </span><br>
<span>此为系统邮件，请勿回复
请保管好您的邮箱，避免账号被他人盗用</span>
";

//$body ="<h3>亲爱的用户：</h3>当您收到这封邮件时，说明您的注册邮箱是有效的。邮箱通过有效验证后，您的账户安全将更有保障。点击此处激活账户 , 如果链接无法点击，请复制并打开以下网址：<br>". $url . "?cfm_hash=";
//$encryption_code = $ca_id . ',' . $email . ',' . $timestamp . ',' . $salt;
//$body .=  urlencode($des->encrypt($encryption_code, $key))."<br><span>此为系统邮件，请勿回复
//请保管好您的邮箱，避免账号被他人盗用</span>";


require_once "db/la_admin.php";
$key_code = get_la_admin_info()["key_code"];

$output_array = send_email_by_agent_service($email,$title,$body,$key_code);

if($output_array["errcode"] == "0"){
    $bind_email = ins_bind_ca_reg_bind_log($data_log_bind);
    $bind_pass = ins_bind_ca_reg_bind_info($data_bind_pass);
    $ret = ins_base_ca_reg_base_info($data_base);
    if ($bind_email && $bind_pass && $ret) {
        exit_ok('Please verify email as soon as possible!');
    } else {
        exit_error('101', 'Create failed! Please try again!');
    }
}
else{
    exit_error('124', '邮件发送失败请稍后重试！');
}

