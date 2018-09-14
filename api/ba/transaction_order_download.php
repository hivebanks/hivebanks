<?php

require_once "../inc/common.php";
require_once "db/us_ba_withdraw_request.php";
require_once "db/la_base.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");
/*
========================== 下载订单信息 ==========================
GET参数
  token               用户TOKEN
返回

说明
  订单信息文件
*/

php_begin();
$args = array("token");
chk_empty_args('GET', $args);

$token = get_arg_str('GET', 'token', 128);
// 获取token中的需求信息
$ba_id = check_token($token);
$row = get_ba_withdraw_request_download_ba_id($ba_id);
$new_rows = array();
foreach ($row as $new_row){
    $row_new["tx_hash"] = $new_row["tx_hash"];
    $row_new["us_id"] = $new_row["us_id"];
    $row_new["ba_id"] = $new_row["ba_id"];
    $row_new["asset_id"] = $new_row["asset_id"];
    $row_new["base_amount"] = $new_row["base_amount"] / get_la_base_unit();
    $row_new["transfer_tx_hash"] = "";
    $row_new["address"] = json_decode($new_row["tx_detail"],true)["bit_address"];
    $row_new["qa_flag"] = $new_row["qa_flag"];
    $new_rows[] = $row_new;
}
downloadCsvData($new_rows);

function downloadCsvData($row = array())
{

    $filename = "order.csv";
    $now = gmdate("D, d M Y H:i:s");
    header("Expires: Tue, 03 Jul 2001 06:00:00 GMT");
    header("Cache-Control: max-age=0, no-cache, must-revalidate, proxy-revalidate");
    header("Last-Modified: {$now} GMT");
// force download
    header("Content-Type: application/force-download");
    header("Content-Type: application/octet-stream");
    header("Content-Type: application/download");
// disposition / encoding on response body
    header("Content-Disposition: attachment;filename={$filename}");
    header("Content-Transfer-Encoding: binary");

    print(chr(0xEF) . chr(0xBB) . chr(0xBF));
//设置utf-8 + bom ，处理汉字显示的乱码
    print_r( array2csv($row));

}

function array2csv(array &$array)
{
    if (count($array) == 0) {
        return null;
    }
    ob_start();
    $df = fopen("php://output", 'w');
    fputcsv($df, array_keys(reset($array)));
    foreach ($array as $row) {
        fputcsv($df, $row);
    }
    fclose($df);
    return ob_get_clean();
}
