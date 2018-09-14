<?php

require_once "../../../inc/common.php";
require_once "db/kyc_user.php";
require_once  "db/la_admin.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*========================== 用户审核拒绝==========================
GET参数
    token        用户token
    us_id        用户的id
返回
    errcode = 0     请求成功

说明
*/

php_begin();
$args = array('token','log_id');
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);
$log_id =  get_arg_str('GET', 'log_id',128);

// 拒绝审核
$res = user_refuse($log_id);

//返回结果
if(!$res)
    exit_error('136','审核失败');
exit_ok();
