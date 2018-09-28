<?php

require_once "../../../inc/common.php";
require_once "db/kyc_user.php";
require_once "db/la_admin.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*========================== 故障信息接受 ==========================
GET参数
    token        用户token
    log_id       日志id
返回
    errcode = 0          请求成功
说明
*/

php_begin();
$args = array("token","log_id");
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);
$log_id = get_arg_str('GET','log_id',11);

//检查la用户
la_user_check($token);
//处理用户反馈
$res = feedback_accept($log_id);
if(!$res)
    exit_error('141','处理失败');
exit_ok();
