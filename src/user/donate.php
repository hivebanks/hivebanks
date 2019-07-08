<?php
/**
 * Created by PhpStorm.
 * User: fanzhuguo
 * Date: 2019/4/23
 * Time: 下午1:21
 */

require_once '../inc/common.php';
require_once '../inc/judge_format.php';
require_once 'db/us_bind.php';
require_once 'db/us_base.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户获取指定银行卡列表 ==========================
GET参数
  token                  用户TOKEN
  account_id              账户id
返回
  errcode = 0            请求成功
说明
*/

php_begin();
$args = array('token', 'amount', 'pass_hash');
chk_empty_args('GET', $args);

// 用户TOKEN
$token = get_arg_str('GET', 'token',128);
// 捐赠金额
$amount = get_arg_str('GET', 'amount');
$pass_hash = get_arg_str('GET', 'pass_hash');
$tips = get_arg_str('GET', 'tips');
$name = get_arg_str('GET', 'name');
//验证token
$us_id = check_token($token);

$tips = json_encode(array('name'=>$name,'tips'=>$tips),JSON_UNESCAPED_UNICODE);

//验证哈希密码
$check_pass_hash = check_pass_hash($us_id,$pass_hash);
if (!$check_pass_hash){
    exit_error("150","资金密码错误");
}

if(donate($us_id,$amount,$tips))
    exit_ok();
exit_error('132','捐赠失败');