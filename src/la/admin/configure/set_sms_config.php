<?php

require_once "../../../inc/common.php";
require_once "../db/la_admin.php";
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
$args = array("token",'key_code');
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token','128');
$key_code = get_arg_str('GET', 'key_code');

$key = Config::TOKEN_KEY;

$la_id = check_token($token);
$row = get_la_by_user($la_id);

if ($row["key_code"] != $key_code) {
    if(!upd_la_admin_key_code($la_id,$key_code))
        exit_error("156","开通失败");
}

$url = "http://agent_service.fnying.com/sms/set_sms_service.php";
$post_data = array();
$post_data["key_code"] = $key_code;


$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
$output = curl_exec($ch);
curl_close($ch);


$output_array = json_decode($output,true);

if($output_array["errcode"] == "0"){

    exit_ok();
}else{
    exit_error("166","提交失败");
}
exit_ok();
