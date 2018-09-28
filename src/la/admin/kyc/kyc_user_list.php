<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/8/2
 * Time: 下午2:46
 */


require_once "../../../inc/common.php";
require_once "db/kyc_user.php";
require_once  "db/la_admin.php";
require_once "../../db/la_func_common.php";
header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");
/*
========================== 获取us认证列表 ==========================
GET参数
    token        用户token

返回
    errcode = 0     请求成功
    rows            列表数组
        log_id        绑定日志id
        us_id          用户id
        bind_type      绑定类型
        bind_name      绑定名称
        bind_info      绑定内容
        bind_salt      绑定的盐
        count_error    错误次数
        limt_time      限定时间戳
        ctime          创建时间

说明
*/

php_begin();
$args = array("token");
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token', 128);

//检查la用户
la_user_check($token);

//获取绑定列表  name&&idNum&&idPhoto
$data_idcard = kyc_user_bind_idcard_list();
$rows = array();
$us_list = array();

//返回结果
$rtn_ary = array();
if($data_idcard) {
    $rtn_ary['errcode'] = '0';
    $rtn_ary['errmsg'] = '';
    $rtn_ary['rows'] = $data_idcard;
    $rtn_str = json_encode($rtn_ary);
}else{
    $rtn_ary['errcode'] = '404';
    $rtn_ary['errmsg'] = 'no data';
    $rtn_ary['rows'] = '';
    $rtn_str = json_encode($rtn_ary);
}

php_end($rtn_str);