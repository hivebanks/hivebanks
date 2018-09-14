<?php

require_once "../../../inc/common.php";
require_once "db/us_base.php";
require_once "db/la_admin.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取us列表 ==========================
GET参数
token              用户token
返回
rows            信息数组
      us_id        用户ID
      us_nm         用户商编号（内部唯一）
      us_account    用户表示账号（内部唯一）
      base_amount   基准资产余额
      lock_amount   锁定余额
      us_type       用户类型
      us_level      用户等级
      security_level安全等级
      utime         更新时间
      ctime         创建时间

说明

*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
$key = Config::TOKEN_KEY;
// 获取token并解密
$des = new Des();
$decryption_code = $des -> decrypt($token, $key);
$now_time = time();
$code_conf =  explode(',',$decryption_code);
// 获取token中的需求信息
$user = $code_conf[0];
$timestamp = $code_conf[1];
if($timestamp < $now_time){
    exit_error('114','Token timeout please retrieve!');
}
//判断la是否存在
$row = get_la_by_user($user);
if(!$row){
    exit_error('112','用户不存在');
}
$rows = get_us_base_info();

//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
