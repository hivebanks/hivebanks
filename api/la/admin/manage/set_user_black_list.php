<?php

require_once "db/la_black_list.php";
require_once "../../../inc/common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 设定用户黑名单列表信息 ==========================
GET参数
     us_id          用户id
     type           处罚性质：1：禁止登录 2 禁止提现 3 禁止充值
     limt_time      处罚到期时间戳
     black_info     处罚原因
返回
    errcode = 0     成功
说明
*/

php_begin();
$args = array('us_id','limt_time','black_info');
chk_empty_args('GET', $args);

$us_id =  get_arg_str('GET', 'us_id');
$black_type = get_arg_str('GET', 'type');
$black_info = get_arg_str('GET', 'black_info');
$limt_time = get_arg_str('GET', 'limt_time');
if ($black_type <= 0 || $black_type > 4)
    exit_error("131","非法参数");
$row = get_black_list_info_by_us_id_and_type($us_id,time(),$black_type);
$data = array();
$data["us_id"] = $us_id;
$data["limt_time"] = strtotime($limt_time);
$data["black_type"] = $black_type;
$data["black_info"] = $black_info;
$data["ctime"] = date('Y-m-d H:i:s');
if (!ins_black_list_info($data))
    exit_error("101","设置失败");
exit_ok();
