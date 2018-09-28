<?php

require_once '../inc/common.php';
require_once 'db/com_feedback.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 故障申告列表 ========================
GET参数
  token             用户token
返回
  errcode = 0     请求成功
  errmsg = ''
  rows            申告列表
说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
//验证token
$us_id = check_token($token);
$res = feedback_list($us_id);
if(!$res)
    exit_error('140','暂时没有申告记录');

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $res;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
