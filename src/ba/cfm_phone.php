<?php

require_once '../inc/common.php';
require_once '../inc/judge_format.php';
require_once 'db/ba_base.php';
require_once 'db/ba_bind.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 请求手机验证 ==========================
GET参数
  cfm_type           验证类型（reg注册验证 bnd绑定验证）
  sms_code           验证码
  country_code       国家代码
  cellphone          手机号码
  cfm_code           图像验证码
返回
  errcode = 0     请求成功

说明
*/

php_begin();
$args = array('country_code', 'sms_code', 'cellphone');
chk_empty_args('GET', $args);

// 国家代码
$country_code = get_arg_str('GET', 'country_code');
//手机号码
$cellphone = get_arg_str('GET','cellphone');
// 验证码
$sms_code = get_arg_str('GET', 'sms_code');
// 验证类型
$cfm_type = get_arg_str('GET', 'cfm_type');

// 创建用户_idba
$ba_id =get_guid();
// 创建用户bind_id
$bind_id = get_guid();
// 判断是否为手机号
$is_phone = isPhone($cellphone);
if(!$is_phone){
    exit_error('100','The input format is incorrect');
}

//获取当前时间戳
$now_time = time();
$variable = 'cellphone';
$variable_code = 'phone_code';
// 判断号码是否已存在
$cellphone_num= $country_code .'-'. $cellphone;
$rec = get_ba_bind_phone($cellphone_num);
if(!$rec){
    exit_error('101','绑定不存在，请重试！');
}
// 获取绑定信息日志表该用户最新的数据
$rec = get_ba_log_bind_by_variable($variable,$cellphone_num);
// 基本信息参数整理
//判断信息是否在规定时间内
if((strtotime($rec['ctime']) + 5*60) < $now_time){
    exit_error('111','信息过期，请重试！');
}
if(empty($rec) || $rec['bind_salt'] != $sms_code || $rec['bind_info']!= $cellphone_num)
    exit_error('110','验证不正确，请重试');
if(($rec['limt_time'] + 29*60) < $now_time)
{
    exit_error("111","验证超时");

}
//已使用的验证码消除使用权限
$userd_salt =  upd_ba_log_bind_variable($variable_code , $cellphone_num);
if(!$userd_salt){
    exit_error('101','验证码被修改');
}

exit_ok();
