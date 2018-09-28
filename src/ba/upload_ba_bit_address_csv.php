<?php

require_once "db/ba_asset_account.php";
require_once "db/ba_base.php";
require_once "recieve_file.php";
require_once '../inc/common.php';

header('Access-Control-Allow-Origin:*');
// 响应类型
header('Access-Control-Allow-Methods:POST');
// 响应头设置
header('Access-Control-Allow-Headers:x-requested-with,content-type');

/*
========================== 更新ba的地址 ==========================
GET参数
    token
返回
  errcode = 0     成功
*/

php_begin();
$args = array('token');
chk_empty_args('POST', $args);

// 用户token
$token = get_arg_str('POST', 'token', 128);
//验证token
$ba_id = check_token($token);
$itme = getCSVdata($_FILES['excel_path']);
$row = get_ba_base_info($ba_id);
if (!$row["ba_type"])
    exit_error("112","系统错误，找不到ba基本信息");
$bit_type = $row["ba_type"];

foreach($itme as $data) {
    if(!sel_single_ba_bit_account_info($ba_id,$data['bit_address']))
        exit_error('103',"地址重复");
    $data['ba_id'] = $ba_id;
    $data['bit_type'] = $bit_type;
    $data['bind_flag'] = "0";
    $data['ctime'] = date("Y-m-d H:i:s");
    $lgn_type = 'phone';
    $utime = time().rand(1000, 9999);
    $ctime = date('Y-m-d H:i:s');
    $us_ip = get_ip();
    $data['account_id'] = hash('md5',$ba_id . $lgn_type . $us_ip .  $utime . $ctime);
    $bind_address = ins_ba_bit_account_info_with_csv($data);
    if (!$bind_address) {
        exit_error('101',"设置失败");
    }
}
exit_ok();
