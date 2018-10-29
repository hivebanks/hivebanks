<?php

require_once "../../../inc/common.php";
require_once  "../db/la_admin.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 重置管理员密码 ==========================
GET参数
    email             邮箱
    user              用户名
返回
  errcode = 0      请求成功
说明
*/

php_begin();
$args = array('email','user');
chk_empty_args('GET', $args);

$email = get_arg_str('GET', 'email', 255);
$user = get_arg_str('GET', 'user', 255);
//检查用户和邮箱是否一致
if(!user_email_check($email,$user))
    exit_error('107','邮箱或用户名错误');

//生成新密码
$password_origin = random_num_chars(8);
$password = sha1($password_origin);

//更新密码
if(!update_password($user,$password,$email))
    exit_error('101','更新密码失败');

//发送邮件，告知新密码
if(email_password($password_origin,$email)["errcode"] == '0')
    exit_error('124','发送邮件失败');

exit_ok();



