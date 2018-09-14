<?php

require_once "../../../inc/common.php";
require_once "db/kyc_user.php";
require_once  "db/la_admin.php";
require_once "../../db/la_func_common.php";
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");
/*========================== 用户审核通过 ==========================
GET参数
    token        用户token
    us_id        用户的id
返回
    errcode = 0     请求成功

说明

*/

php_begin();
$args = array('token','us_id','bind_name','bind_info','log_id');
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);
$us_id =  get_arg_str('GET', 'us_id',128);
$bind_name =  get_arg_str('GET', 'bind_name',99);
$bind_info =  get_arg_str('GET', 'bind_info',99);
$log_id = get_arg_str('GET', 'log_id' , 99);
$bind_id = get_guid();

//检查la用户
la_user_check($token);
//判断绑定类型
switch ($bind_name)
{
    case 'name':
        $res = name_pass($us_id,$bind_info,$bind_id,$log_id);
        break;
    case 'idNum':
        $res = idNum_pass($us_id,$bind_info,$bind_id,$log_id);
        break;
    case 'idPhoto':
        $res = idPhoto_pass($us_id,$bind_info,$bind_id,$log_id);
        break;
    default:
        exit_error('-1');
        break;
}

//返回结果
if(!$res)
    exit_error('136','审核失败');
exit_ok();
