<?php

require_once "../../../inc/common.php";
require_once "db/kyc_user.php";
require_once "db/la_admin.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*========================== 故障信息列表 ==========================
GET参数
     token        用户token
返回
    errcode = 0          请求成功
    rows            故障信息列表
       log_id            日志id
       sub_id            模块id
       end_type          终端类型
       submit_time       提交时间
       submit_id         提交id
       submit_name       提交用户昵称
       submit_info       提交信息
       analyse_time       分析时间
       analyse_info       原因分析
       analyse_id         分析人id
       analyse_name       分析人昵称
       del_time           处理时间
       deal_id            处理人id
       deal_name          处理人昵称
       deal_info          处理意见
       log_status         处理状态( 0 未处理 1 已受理 2 已分析 9 已处理)
说明
*/

php_begin();
$args = array("token",'is_deal');
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);
//$limit = get_arg_str('GET', 'limit', 128);
//$offset = get_arg_str('GET', 'offset', 128);
$is_deal = get_arg_str('GET', 'is_deal', 128);

//检查la用户
la_user_check($token);

//获取feedback注册列表
$feedback_list = feedback_list($is_deal);
if(!$feedback_list){

    $rtn_ary = array();
    $rtn_ary['errcode'] = '0';
    $rtn_ary['errmsg'] = '';
    $rtn_ary['rows'] = '' ;

    $rtn_str = json_encode($rtn_ary);
    php_end($rtn_str);
}


//返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $feedback_list ;

$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
