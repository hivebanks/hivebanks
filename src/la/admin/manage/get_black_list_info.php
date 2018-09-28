<?php

require_once "db/la_black_list.php";
require_once "../../../inc/common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取用户黑名单列表信息 ==========================
GET参数
 us_id          用户id
返回
rows            信息数组
   log_id       绑定日志ID
   us_id        用户ID
   black_type   处罚性质：1：禁止登录 2 禁止提现 3 禁止充值
   black_info   处罚原因
   ttl_id       操作者ID
   limt_time    处罚到期时间戳
   ctime        创建时间

说明

*/

php_begin();
$args = array('us_id');
chk_empty_args('GET', $args);
$us_id =  get_arg_str('GET', 'us_id');
$rows = get_black_list_info_by_us_id($us_id,time());
$new_row = array();
foreach ($rows as $row){
    $rows_new["limit_time"] = date('Y-m-d H:i:s', $row['limt_time']);
    $rows_new["black_type"] =  $row['black_type'];
    $rows_new["black_info"] = $row['black_info'];
    $rows_new["ctime"] = $row['ctime'];
    $new_row[] = $rows_new;
}
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $new_row;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
