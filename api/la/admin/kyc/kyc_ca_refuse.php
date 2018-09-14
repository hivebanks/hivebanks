<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/8/16
 * Time: 下午2:15
 */


require_once "../../../inc/common.php";
require_once "db/kyc_ca.php";
require_once  "db/la_admin.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*========================== ca审核拒绝 ==========================
GET参数
    token        用户token
    log_id        ca的绑定表id
返回
    errcode = 0     请求成功

说明
*/

php_begin();
$args = array("token","log_id");
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);
$log_id =  get_arg_str('GET', 'log_id');

//检查la用户
la_user_check($token);

//更新绑定资料状态 count_error 2通过 1拒绝
$data = log_bind_refuse($log_id);

//返回数据
if(!$data)
    exit_error('141','更新审核失败');

exit_ok();
