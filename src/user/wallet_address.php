<?php

require_once '../inc/common.php';
require_once 'db/us_asset_bit_account.php';
require_once '../inc/judge_format.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户数字货币外部账号绑定 ==========================
GET参数
  token             用户TOKEN
  bit_type          地址类型
  address           数字货币地址

返回
  errcode = 0     请求成功

说明
  绑定数字货币地址
*/

php_begin();
$args = array('token', 'bit_type', 'bit_address');
chk_empty_args('GET', $args);


// 用户TOKEN
$token = get_arg_str('GET', 'token',128);
// 文本类型
$bit_type = get_arg_str('GET', 'bit_type',255);
// 文本内容
$bit_address = get_arg_str('GET', 'bit_address', 255);
// 密码的hash
$pass_word_hash = get_arg_str('GET', 'pass_word_hash',128);

//验证token
$us_id = check_token($token);

// 参数整理
$data_bind = array();
$data_bind['us_id'] = $us_id;
$data_bind['bit_type']  = $bit_type;
$data_bind['bit_address'] = $bit_address;
$data_bind['bind_flag'] = 1;
$data_bind['utime'] =time();
$data_bind['ctime'] = date("Y-m-d H:i:s");

//获取该用户是否存在当前数字货币地址
$ret = get_us_bit_address($us_id,$bit_type);
//判断当前地址和绑定地址是否相同
if($ret['bit_address'] == $bit_address){
    exit_error('109','绑定地址与源地址相同！不需要重复绑定');
}
if($ret){
    //把已存在的地址设为不可用
    $rec = set_used_bit_address($us_id,$bit_type);
    $data_bind['account_id'] =$ret['account_id'];
    if(!$rec){
        exit_error('109',"原先地址可用！");
    }
    $retu = ins_us_bit_address($data_bind);
}

$data_bind['account_id'] = hash('md5',$us_id . $data_bind['bit_type']  . $data_bind['bit_address'] .  $data_bind['utime'] . $data_bind['ctime']);
//插入新的地址
$retu = ins_us_bit_address($data_bind);
if(!$retu){
    exit_error('101','地址添加失败，请重试！');
}
exit_ok();
