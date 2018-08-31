<?php
require_once "../../../inc/common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 设置短信配置 ==========================
GET参数
    token                   用户token
    accessKeyId             短信服务商id
    accessKeySecret         短信服务商密钥
    SignName                签名
    TemplateCode            模板编号
返回
  errcode = 0      请求成功
  row             返回配置信息
说明
*/

php_begin();
$args = array("token",'accessKeyId','accessKeySecret','SignName','TemplateCode');
chk_empty_args('GET', $args);
$token = get_arg_str('GET', 'token');
$accessKeyId = get_arg_str('GET', 'accessKeyId');
$accessKeySecret = get_arg_str('GET', 'accessKeySecret');
$SignName = get_arg_str('GET', 'SignName');
$TemplateCode = get_arg_str('GET', 'TemplateCode');
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
$data["accessKeyId"] = $accessKeyId;
$data["accessKeySecret"] = $accessKeySecret;
$data["SignName"] = $SignName;
$data["TemplateCode"] = $TemplateCode;

file_put_contents('../../../plugin/sms/config.json',json_encode($data));
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['row'] = $data;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
