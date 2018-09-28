<?php

require_once "../../../inc/common.php";
require_once "db/kyc_user.php";
require_once "db/la_admin.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*========================== 故障信息处理 ==========================
GET参数
     token        用户token
     log_id        日志id
     deal_info      处理信息
     deal_name      处理人昵称
返回
    errcode = 0          请求成功
说明
*/

php_begin();
$args = array("token","log_id","deal_info","deal_name");
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);
$log_id = get_arg_str('GET','log_id',11);
$analyse_info = get_arg_str('GET','deal_info',999);
$analyse_name = get_arg_str('GET','deal_name',50);

//检查la用户
$deal_id = la_user_check($token);

$data = array();
$data['log_id'] = $log_id;
$data['deal_info'] = $analyse_info;
$data['deal_name'] = $analyse_name;
$data['deal_id'] = $deal_id;

//处理用户反馈
$res = feedback_done($data);

if(!$res)
    exit_error('141','处理失败');
exit_ok();