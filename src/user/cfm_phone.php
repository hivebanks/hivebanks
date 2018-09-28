<?php

require_once '../inc/common.php';

require_once 'db/us_bind.php';
require_once 'db/us_base.php';
require_once 'db/us_log_bind.php';
require_once '../inc/judge_format.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 请求手机验证 ==========================
GET参数
  sms_code        短信验证码
  country_code    国家代码
  cellphone       手机号码

返回
  errcode = 0     请求成功

说明
  手机验证流程
  场景一：用户使用手机号码作为用户名进行注册
          用户注册（手机）API reg_phone.php 向用户手机发送验证码。
          用户收到验证码并输入确认

  场景二：用户需要绑定自己的手机（使用邮箱验证作为自己用户名进行注册的情况）
          文本绑定API bnd_text.php  向用户手机发送验证码。
          用户收到验证码并输入确认

  流程
  ========================== 输入数据检查 ==========================
  判定国家代码和手机代码是否有效
  判定短信验证码格式是否有效

  ========================== 绑定业务检查 ==========================
  从us_bind_log表取得满足以下条件的最新数据(utime最大)：
    bind_type = 'text'
    AND bind_name = 'cellphone'
    AND bind_info = 国家代码+'-'+手机号码

  如果数据不存在返回无有效绑定信息
  若绑定限制时间戳 < 当前时间戳返回验证时间已过期
  若绑定验证码 != 短信验证码返回验证码错误

  ========================== 有效绑定成功 ==========================
  创建us_bind记录
    bind_type = 'text'
    us_id = 解密结果的us_id
    bind_name = cellphone'
    bind_info = 国家代码+'-'+手机号码
    flag = 1(已绑定)

*/

php_begin();
$args = array('sms_code', 'country_code', 'cellphone');
chk_empty_args('GET', $args);

// 国家代码
$country_code = get_arg_str('GET', 'country_code');
//手机号码
$cellphone = get_arg_str('GET','cellphone');
// 短信验证码
$sms_code = get_arg_str('GET', 'sms_code');
//获取当前时间戳
$now_time = time();
// 判断是否为手机号
$is_phone = isPhone($cellphone);
if(!$is_phone){
    exit_error('100','The input format is incorrect');
}

$variable = 'cellphone';
$variable_code = 'phone_code';
$now_time = time();
// 判断号码是否已存在
$cellphone_num= $country_code .'-'. $cellphone;
$rec = get_user_bind_phone($cellphone_num);
if(!$rec){
    exit_error('112','绑定不存在，请重试！');
}

// 获取绑定信息日志表该用户最新的数据
$ret = get_us_log_bind_by_variable($variable_code,$cellphone_num);

//判断信息是否在规定时间内
if((strtotime($ret['ctime']) + 15*60) < $now_time){
    exit_error('111','信息过期，请重试！');
}
if(empty($ret) || $ret['bind_salt'] != $sms_code || $ret['bind_info']!= $cellphone_num)
    exit_error('110','验证不正确，请重试');
if(($ret['limt_time'] + 29*60) < $now_time)
{
    exit_error("111","验证超时");

}
//已使用的验证码消除使用权限
$userd_salt =  upd_us_log_bind_variable($variable_code , $cellphone_num);
if(!$userd_salt){
    exit_error('101','验证码被修改');
}

exit_ok();
