<?php

require_once '../../../inc/common.php';
require_once '../db/la_admin.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 添加管理员 ==========================
GET参数
    token             用户token
    pid               权限id(逗号隔开例如1，2，3)
    real_name         真实姓名
    pass_word_hash    密码hash
    user              用户名
返回
    errcode = 0       成功
说明
*/

php_begin();
$args = array('user','token','pid', 'real_name','pass_word_hash');
chk_empty_args('GET', $args);

// 密钥
$key = Config::TOKEN_KEY;
// 用户名
$user_new = get_arg_str('GET', 'user');
// 权限ID
$pid = get_arg_str('GET', 'pid');
// 密码HASH
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');
//真实姓名
$real_name = get_arg_str('GET', 'real_name');
// 用户token
$token = get_arg_str('GET', 'token', 128);

$key = Config::TOKEN_KEY;
// 获取token并解密
$des = new Des();
$decryption_code = $des -> decrypt($token, $key);
$now_time = time();
$code_conf =  explode(',',$decryption_code);
// 获取token中的需求信息
$user = $code_conf[0];
$timestamp = $code_conf[1];
if($timestamp < $now_time){
    exit_error('114','Token timeout please retrieve!');
}

//判断la是否存在
$row = get_la_by_user($user);
if(!$row){
    exit_error('112','用户不存在');
}
//登陆ip
$ip = get_ip();
//登陆城市
$city = '上海';

//参数整理
$data_set = array();
$data_set['user']= $user_new;
$data_set['pwd'] = $pass_word_hash;
$data_set['real_name'] = $real_name;
$data_set['pid'] = $pid;
$data_set['last_login_ip'] = $ip;
$data_set['last_login_city'] = $city;
$data_set['last_login_time'] = time();

//把管理员信息写入库
$ret = admin_add($data_set);
if(!$ret){
    exit_error('101','添加失败，请重试！');
}

exit_ok();
