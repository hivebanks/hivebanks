<?php
require_once '../inc/common.php';
require_once 'db/ba_bind.php';
require_once 'db/ba_base.php';
require_once 'db/ba_log_bind.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 文件绑定 ==========================
GET参数
  token           用户token
  file_type       文件类型
  file_url        上传文件url
  file_hash       上传文件hash
返回
  errcode = 0     请求成功
说明
绑定SSH证书，身份证，护照，手持文件图片等
*/

php_begin();
$args = array('token','file_type','file_url','file_hash');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
// 密码HASH
$pass_word_hash = get_arg_str('GET', 'pass_word_hash');
// 文件类型
$file_type = get_arg_str('GET', 'file_type');
// 文件url
$file_url = get_arg_str('GET', 'file_url',255);
// 文件hash
$file_hash = get_arg_str('GET','file_hash');
//验证token
$ba_id = check_token($token);

if($file_hash=='undefined,undefined' || $file_url == 'undefined,undefined')
    exit_error('104','文件内容获取失败');
// 参数整理
$data_bind = array();
$data_bind['bind_type']  = 'file';
$data_bind['bind_name'] = $file_type;
$data_bind['bind_info'] = $file_url . $file_hash;

//获取当前用户的绑定信息
$bind_info_us = get_ba_bind_info_by_token($ba_id);
foreach ($bind_info_us as $ba_info)
{
    if($ba_info['bind_name'] == $file_type){
        //更新该条数据
        $ret_us = upd_bind_info_for_ba_id($ba_id,$file_type);
        if(!$ret_us)
            exit_error('101','信息绑定失败，请重试！');
    }
}
// 绑内容是否存在
$ret_bind = check_bind_info($data_bind);

if($ret_bind){
    exit_error('105','The binding already exists please try again！');
}
$ret = bind_log_info($ba_id,$data_bind);
if(!$ret){
    exit_error('101','Binding failed, please try again!');
}
//安全等级提升
$savf_level = get_bind_acount($ba_id);
//更新安全等级
$upd_us_level = upd_savf_level($ba_id,$savf_level);
exit_ok('0','The upload has been completed, please wait patiently for the review!');
