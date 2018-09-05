<?php
require_once '../inc/common.php';
require_once '../plugin/email/send_email.php';
require_once 'db/us_bind.php';
require_once 'db/us_base.php';
require_once 'db/us_log_bind.php';
require_once '../inc/judge_format.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 文本绑定 ==========================
GET参数
  token           用户TOKEN
  text_type       文本类型
  text            文本内容
  text_hash       文本内容HASH
返回
  errcode = 0     请求成功

说明
  绑定手机，邮箱，姓名，身份证，第三方账号等
*/


    $ret = send_email($name='ssh', '18321709102@163.com', 'syc', 'test');
    if($ret){
    exit_ok('Please verify email as soon as possible!');
  }else{
    exit_error('101', 'Create failed! Please try again!');
  }

