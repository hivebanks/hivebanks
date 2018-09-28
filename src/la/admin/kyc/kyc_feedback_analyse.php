<?php

require_once "../../../inc/common.php";
require_once "db/kyc_user.php";
require_once "db/la_admin.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*========================== 故障信息分析 ==========================
GET参数
    token        用户token
    log_id        日志id
    analyse_info  分析信息
    analyse_name  分析人昵称
返回
    errcode = 0          请求成功
说明
*/

php_begin();
$args = array("token","log_id","analyse_info","analyse_name");
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);
$log_id = get_arg_str('GET','log_id',11);
$analyse_info = get_arg_str('GET','analyse_info',999);
$analyse_name = get_arg_str('GET','analyse_name',50);

//检查la用户
$analyse_id = la_user_check($token);

$data = array();
$data['log_id'] = $log_id;
$data['analyse_info'] = $analyse_info;
$data['analyse_name'] = $analyse_name;
$data['analyse_id'] = $analyse_id;

//分析用户反馈
$res = feedback_analyse($data);

if(!$res)
    exit_error('141','分析失败');
exit_ok();
