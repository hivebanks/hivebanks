<?php

require_once '../inc/common.php';
require_once 'db/com_feedback.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 故障申告提交 ==========================
GET参数
  token             用户token
  sub_id            模块 user/ba/ca
  end_type          客户端类型 H5 WX WEB
  submit_name       提交人昵称
  submit_info       提交信息
返回
  errcode = 0     请求成功
说明
*/


php_begin();

$args = array('token','sub_id','end_type','submit_name','submit_info');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
//验证token
$us_id = check_token($token);

$data = array();
$data['submit_time'] = date('Y-m-d H:i:s',time());
$data['submit_id'] = $us_id;
$data['submit_name'] = get_arg_str('GET','submit_name',128);
$data['sub_id'] = get_arg_str('GET','sub_id',10);
$data['end_type'] = get_arg_str('GET','end_type',10);
$data['submit_info'] = get_arg_str('GET','submit_info',999);

$res = feedback_submit($data);
// 故障提交是否成功
if(!$res)
    exit_error('101','提交失败');
exit_ok();
