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
  account_id              账户id
返回
  errcode = 0            请求成功
说明
*/

php_begin();
$args = array('token', 'account_id');
chk_empty_args('GET', $args);

// 用户TOKEN
$token = get_arg_str('GET', 'token',128);
// 添加时间
$account_id = get_arg_str('GET', 'account_id');
//验证token
$us_id = check_token($token);
//删除银行卡账户信息
$rets = del_us_asset_account_info($us_id,$account_id);
if(!$rets){
    exit_error('117','未绑定银行卡');
}
//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
