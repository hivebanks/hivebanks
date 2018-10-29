<?php

require_once "../../../inc/common.php";
require_once "../db/la_admin.php";
require_once "../../../plugin/ip_service/get_ip.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

#ini_set("display_errors", "On");
#error_reporting(E_ALL | E_STRICT);
/*
========================== 用户登陆 ==========================
GET参数
user               账号
password           原始密码
返回
  errcode = 0      请求成功
  token            用户TOKEN
说明
  登录成功返回用户TOKEN,有效期2小时
*/

php_begin();
$args = array('user', 'pass_word_hash');
chk_empty_args('GET', $args);

// 密钥
$key = Config::TOKEN_KEY;
// 用户名
$user = get_arg_str('GET', 'user', 255);
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');
//登陆ip
$ip = get_ip();
//登陆城市
$city = getIpInfo($ip);
// 加盐加密
$salt = rand(10000000, 99999999);
//登陆时间
$login_time = time();
//检查登陆错误次数
if(login_failed_log_count($user,$login_time)>3)
    exit_error('108','登陆错误次数过多,请三十分钟后再登陆');
// 检测登录
$res_login = login_check($user,$pass_word_hash);
if(!$res_login) {
//记录登陆失败，
    $data_failed = array();
    $data_failed['login_ip'] = $ip;
    $data_failed['user'] = $user;
    $data_failed['login_time'] = $login_time;
    $data_failed['login_status'] = 0;
    login_log($data_failed);
    exit_error('107','用户名密码不正确');
}
//登陆成功记录
$data_bingo = array();
$data_bingo['login_ip'] = $ip;
$data_bingo['user']     = $user;
$data_bingo['login_time'] = $login_time;
$data_bingo['login_status'] = 1;
login_log($data_bingo);
$user_info = login_user_info($user);
// 生成token
$timestamp = time() + 2*60*60;
$des = new Des();
$encryption_code = $user_info['user_info']['id'].',' . $timestamp . ',' . $salt;
$token = $des -> encrypt($encryption_code, $key);
//@TODO
login_bingo_update($user,$ip,$city,$login_time);
// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['token'] = $token;
$rtn_ary['rows'] = $user_info;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
