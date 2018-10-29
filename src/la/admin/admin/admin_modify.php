<?php

require_once '../../../inc/common.php';
require_once '../db/la_admin.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 编辑管理员 ==========================
GET参数
    token             用户token
    user              用户名
    pass_word_hash    密码hash
    real_name          真实姓名
    pid                 权限id
返回
  errcode = 0      请求成功

说明
*/

php_begin();
$args = array('token','pass_word_hash');
chk_empty_args('GET', $args);

// 密钥
$key = Config::TOKEN_KEY;
// 用户名
$user = get_arg_str('GET', 'user');
// 密码HASH
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');

// 用户token
$token = get_arg_str('GET', 'token', 128);
//真实姓名
$real_name  = get_arg_str('GET', 'real_name');
//权限id
$pid        =  get_arg_str('GET', 'pid');

$key = Config::TOKEN_KEY;
// 获取token并解密
$des = new Des();
$decryption_code = $des -> decrypt($token, $key);
$now_time = time();
$code_conf =  explode(',',$decryption_code);
// 获取token中的需求信息
$user_admin = $code_conf[0];
$timestamp = $code_conf[1];
if($timestamp < $now_time){
    exit_error('114','Token timeout please retrieve!');
}
//判断la是否存在
$row = get_la_by_user($user_admin);
if(!$row){
    exit_error('112','用户不存在');
}
// 检测密码是否正确
$ret = login_check($user_admin,$pass_word_hash);
if(!$ret){
    exit_error('107','用户名或者密码错误');
}

//参数整理
$data = array();
$data['user'] = $user;
$data['pid'] = $pid;
$data['real_name'] = $real_name;
$data['login_ip'] = $ip;
$data['login_time'] = $login_time;
$data['login_status'] = 1;
//更新该管理员下的管理员信息
$ret = modify_admin($data);
if(!$ret){
    exit_error('101','修改失败，请重试！');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
