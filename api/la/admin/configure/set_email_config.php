<?php
require_once "../../../inc/common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 设置email信息 ==========================
GET参数
    token             用户token
    Host               邮箱类型
    Username           邮箱姓名
    Password           邮箱密码（授权码，非真实密码）
    address            邮箱地址
    name               发送头名称
返回
  errcode = 0      请求成功
  row             返回配置信息

说明
*/

php_begin();
$args = array("token",'Host','Username','Password','address','name');
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token');
$Host = get_arg_str('GET', 'Host');
$Username = get_arg_str('GET', 'Username');
$Password = get_arg_str('GET', 'Password');
$address = get_arg_str('GET', 'address');
$name = get_arg_str('GET', 'name');
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

$data = array();
$data["Host"] = $Host;
$data["Username"] = $Username;
$data["Password"] = $Password;
$data["address"] = $address;
$data["name"] = $name;

file_put_contents('../../../plugin/email/email_config.json',json_encode($data));
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['row'] = $data;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);

