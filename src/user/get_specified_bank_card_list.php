<?php

require_once '../inc/common.php';
require_once '../inc/judge_format.php';
require_once 'db/us_bind.php';
require_once 'db/us_base.php';
require_once  'db/us_asset_cash_account.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户获取指定银行卡列表 ==========================
GET参数
  token                  用户TOKEN
  cash_channel           渠道
返回
  errcode = 0            请求成功
  cash_type              法币类型
  cash_address           法币账户
  name                   姓名
  ctime                  创建时间
说明
  同一类型下的地址是唯一的
*/

php_begin();
$args = array('token', 'cash_channel');
chk_empty_args('GET', $args);

// 用户TOKEN
$token = get_arg_str('GET', 'token',128);
// 渠道
$cash_channel = get_arg_str('GET', 'cash_channel');
//验证token
$us_id = check_token($token);

//获取指定银行卡列表
$rets = us_get_specified_asset_account_info($us_id,$cash_channel);
if(!$rets){
    exit_error('117','未绑定银行卡');
}
$rows = array();
foreach ($rets as $ret) {
    $row["lgl_address"] = json_decode($ret["lgl_address"]);
    $row["account_id"] = $ret["account_id"];
    $row["bind_flag"] = $ret["bind_flag"];
    $row["cash_type"] = $ret["cash_type"];
    $row["ctime"] = $ret["ctime"];
    $row["cash_channel"] = $ret["cash_channel"];
    $rows[] = $row;
}
//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
