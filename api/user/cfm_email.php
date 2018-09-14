<?php
require_once '../inc/common.php';
require_once 'db/us_base.php';
require_once 'db/us_bind.php';
require_once  'db/us_log_bind.php';
require_once '../inc/judge_format.php';
require_once "../inc/common_agent_email_service.php";
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 邮箱验证确认 ==========================
GET参数
 cfm_hash          验证链接hash
返回
  errcode = 0       成功
说明
*/
php_begin();
$args = array('cfm_hash');
chk_empty_args('GET', $args);

// 当前时间戳
$now_time = time();
// 获取cfm_hash
$cfm_hash = get_arg_str('GET','cfm_hash',255);

$key = Config::TOKEN_KEY;
// 获取token并解码
$des = new Des();
$decryption_code = $des -> decrypt($cfm_hash, $key);
$code_conf =  explode(',',$decryption_code);

if(is_array($code_conf) && count($code_conf) < 4){
    exit_error('115','认证信息发生变化，请重试');
}
// 获取token中的需求信息
$us_id = $code_conf[0];
$email = $code_conf[1];
$timestamp = $code_conf[2];
$email_confirm =  $code_conf[3];

$is_email = isEmail($email);
if(!$is_email){
  exit_error('100','Email format not correct!');
}

if($email_confirm != 'email'){
    $email_confirm = '注册';
}else{
  $email_confirm = '绑定';
}

$variable = 'email';
// 判断邮箱是否已存在
$row = get_us_id_by_variable($variable,$email);

//获取绑定信息日志表该用户最新的数据
$rec = get_us_log_bind_by_variable($variable,$email);
if($row){
    // 判断是否注册完成
    if ($row['us_id'] && $row['bind_flag'] == 1) {
        exit_error('105','已注册用户，请登陆！');
    }
}

// 判断是否注册
if(!$rec['us_id'] && ($email_confirm =='注册')){
  exit_error('112','This email address is not registered');

}
//判断是否可以进行验证
if($rec['limt_time'] > $now_time){
  exit_error('116',$rec['limt_time'] - $now_time);
}
// 验证超时判定
$data_log_bind = array();
if($now_time < $timestamp)
{
  if($rec['limt_time'] > $now_time){
    exit_error('116',$rec['limt_time'] - $now_time);
  }else{
    $bind_id = get_guid();
    $data_bind =array();
    // 绑定信息整理
    $data_bind['bind_id'] = $bind_id;
    $data_bind['us_id'] = $us_id;
    $data_bind['bind_info'] = $email;
    $data_bind['bind_name'] = 'email';
    $data_bind['bind_flag'] = 1;
    $data_bind['bind_type'] = 'text';
   // 确认绑定
   $bind_email = ins_bind_user_reg_bind_info($data_bind);
   $email_used = upd_us_log_bind_info($us_id);
   //获取当前绑定数
  $savf_level = get_bind_acount($us_id);
  //安全等级提升
  $upd_us_level = upd_savf_level($us_id,$savf_level);
   if($bind_email && ($email_confirm =='注册')){
       $url_r = Config::H5_US_URL_R;
       header("Location: ".$url_r);
       exit_ok();
   }
   if($bind_email && ($email_confirm =='绑定')){
       $url_b = Config::H5_US_URL_B;
       header("Location: ".$url_b);
       exit_ok();
   }
   exit_error('121',"操作失败请重试");
  }
}
$url = Config::CONFORM_URL;
$salt = rand(100000,999999);
$title = '邮箱验证链接';
$des = new Des();
$now_time +=15*60;

$body ="<h3>亲爱的用户：</h3>当您收到这封邮件时，说明您的注册邮箱是有效的。
<br>邮箱通过有效验证后，您的账户安全将更有保障。
<br>点击此处激活账户 , 如果链接无法点击，请复制并打开以下网址：<br>
<br>". $url . "?cfm_hash=";
$encryption_code = $us_id . ',' . $email . ',' . $now_time . ',' . $salt;
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
if($output_array["errcode"] == "0"){
    header('Content-Type:text/html;charset=utf-8');
    header("Location: ". Config::H5_URL ."user/defeated.html");
//$bind_id = get_guid();
    $data_bind =array();

    $data_log_bind= $rec;
    $data_log_bind['count_error'] = $rec['count_error']+1;
    $data_log_bind['limt_time'] = ($now_time - 15*60) + pow(2,$data_log_bind['count_error']);
    unset($data_log_bind['log_id']);
    $rer_p = ins_bind_user_reg_bind_log($data_log_bind);
    if(!$rer_p)
        exit_error('101','记录日志创建失败，请重试');
    exit_error();

}else{
    exit_error('124','邮件发送失败，请重试');
}

