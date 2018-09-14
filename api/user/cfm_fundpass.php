<?php

require_once '../inc/common.php';
require_once 'db/us_base.php';
require_once 'db/us_bind.php';
require_once  'db/us_log_bind.php';
require_once '../inc/judge_format.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");
/*
GET参数
  token                   用户token
  cfm_fundPass            资金密码hash
返回
  errcode = 0           验证成功
说明
  资金密码和账号密码不能相同
*/
php_begin();
$args = array('token', 'cfm_fundPass');
chk_empty_args('GET', $args);
// 用户TOKEN
$token = get_arg_str('GET', 'token',128);
// 用户TOKEN
$cfm_fundPass = get_arg_str('GET', 'cfm_fundPass',128);
//验证token
$us_id = check_token($token);

$vail = "pass_hash";
//判断用户是否存在
$us_exit = chexk_us_exit($us_id);
if(!$us_exit)
{
    exit_error('112','用户不存在');
}
//获取资金密码
$pass_hash = get_pass_hash($us_id,$vail);

if(!$pass_hash){
    exit_error('106','资金密码未绑定');
}
if($pass_hash != $cfm_fundPass)
{
    exit_error('102','资金密码不正确');
}
exit_ok();
