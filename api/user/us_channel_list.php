<?php

require_once  '../inc/common.php';
require_once  'db/com_option_config.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 用户绑定渠道列表 ==========================
GET参数
    token          请求的用户token

返回
    errcode = 0     成功返回码
    rows            返回列表数组
      option_key    渠道关键字
      option_value  渠道全称

说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
//验证token
$us_id = check_token($token);
$rows = us_get_us_channel_list();
//成功后返回数据
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary["rows"] = $rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
