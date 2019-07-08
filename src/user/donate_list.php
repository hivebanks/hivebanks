<?php
/**
 * Created by PhpStorm.
 * User: fanzhuguo
 * Date: 2019/4/23
 * Time: 下午1:48
 */

require_once '../inc/common.php';
require_once '../inc/judge_format.php';
require_once 'db/us_bind.php';
require_once 'db/us_base.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 获取捐赠列表 ==========================
GET参数
  token                  用户TOKEN
  account_id              账户id
返回
  errcode = 0            请求成功
说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 用户TOKEN
$token = get_arg_str('GET', 'token',128);

// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');

//验证token
$us_id = check_token($token);

$rows = donate_list($us_id,$offset,$limit);
$total = donate_count($us_id);

// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_ary['total'] = $total;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
