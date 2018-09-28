<?php

require_once "../inc/common.php";
require_once "../ba/db/us_ba_recharge_request.php";

/*
========================== 删除请求的充值订单 ==========================
GET参数
  token          请求的用户token
  qa_id           请求ID
返回
  errcode = 0     请求成功
说明
*/

php_begin();

//$args = array('token',"qa_id");
//chk_empty_args('GET', $args);
//$token = get_arg_str('GET', 'token', 128);
//$qa_id =  get_arg_str('GET', 'qa_id');
//$key = Config::TOKEN_KEY;
// 获取token并解密
//$des = new Des();
//$decryption_code = $des -> decrypt($token, $key);
//$now_time = time();
//$code_conf =  explode(',',$decryption_code);
// 获取token中的需求信息
//$ca_id = $code_conf[0];
//$timestamp = $code_conf[1];
//if($timestamp < $now_time){
//    exit_error('114','Token timeout please retrieve!');
//}
//$recharge_row = sel_recharge_ba_base_amount_info($qa_id);
//$tx_detail = json_decode($recharge_row["tx_detail"]);

$url = "https://chain.api.btc.com/v3/address/15urYnyeJe3gwbGJ74wcX89Tz7ZtsFDVew/tx";

$new_data = json_decode(curl_get($url),true);
$list_Arr = $new_data["data"]["list"];
$fisrt_arr = current($list_Arr);
$confirmations = $fisrt_arr["confirmations"];
if ($confirmations < 2)
    exit_error("145","交易小于2");
$block_time = $fisrt_arr["block_time"];
if ($block_time < $recharge_row["tx_time"])
    exit_error("146","交易时间小于订单时间");
$outputs_arr =  $fisrt_arr["outputs"];

foreach ($outputs_arr as $row){
    print_r(current($row["addresses"]));
    if ($row["value"]  = $recharge_row["base_amount"] * 100000000 && $tx_detail["bit_address"] = current($row["addresses"])){
        exit_ok();
    }else {
        exit_error("135","交易未确认");
    }
}
function curl_get($url){

    $testurl = $url;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $testurl);
    //参数为1表示传输数据，为0表示直接输出显示。
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //参数为0表示不带头文件，为1表示带头文件
    curl_setopt($ch, CURLOPT_HEADER,0);
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}