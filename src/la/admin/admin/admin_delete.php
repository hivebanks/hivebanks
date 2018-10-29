<?php

require_once '../../../inc/common.php';
require_once '../db/la_admin.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 删除管理员 ==========================
GET参数
    token             用户token
    user              用户名
    pass_word_hash    密码hash
返回
  errcode = 0      请求成功
说明
*/

php_begin();
$args = array('token','user','pass_word_hash');
chk_empty_args('GET', $args);

// 密钥
$key = Config::TOKEN_KEY;
// 权限ID
$user = get_arg_str('GET', 'user');
// 密码HASH
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');

// 用户token
$token = get_arg_str('GET', 'token', 128);

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
//删除该管理员下的管理员
$ret = delect_admin($user);
if(!$ret){
    exit_error('101','删除失败，请重试！');
}

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
