<?php

require_once  '../inc/common.php';
require_once  'db/ca_asset_account.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*========================== 获取ca资产地址 ==========================
GET参数
    token          请求的用户token
返回
    errcode = 0     成功返回码
    account_id      账户id
    ca_id           用户id
    ca_channel      ca渠道
    lgl_address     法定货币地址
    use_flag        使用标志
    ctime           创建时间

说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
//验证token
$ca_id = check_token($token);
$rows = ca_get_asset_account_info($ca_id);
$new_rows = array();
foreach ($rows as $row) {
    $new_row["lgl_address"] = json_decode($row["lgl_address"]);
    $new_row["account_id"] = $row["account_id"];
    $new_row["use_flag"] = $row["use_flag"];
    $new_row["ca_channel"] = $row["ca_channel"];
    $new_rows[] = $new_row;
}
//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary["rows"] = $new_rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
