<?php
require_once '../inc/common.php';
require_once 'db/ba_log_login.php';

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

/*
========================== 登录记录查询 ==========================
GET参数
  token                用户token
  limit                分页记录
  offset               分页偏移量
返回
  total                总记录数
  rows                 记录数组
    lgn_type           登录类型(email:邮件账号，phone:手机账号，oauth:第三方)
    lgn_ip             登录ip
    lgn_ip_area        登录地区
    ctime              登录时间
说明
*/

php_begin();
$args = array('token');
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token');
$limit = get_arg_str('GET', 'limit');
$offset = get_arg_str('GET', 'offset');
//验证token
$ba_id = check_token($token);
// 取得分页参数
list($limit, $offset) = get_paging_arg('GET');
// 获取登录记录总数
$total = get_lgn_log_total($ba_id);
$rows = array();
// 获取登录记录
$log_rows = get_lgn_log($ba_id,$limit,$offset);
// ip地址转换
foreach($log_rows as $row){
  $row['ba_ip'] = long2ip($row['ba_ip']);
  $rows[] = $row;
}
// 返回数据做成
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $rows;
$rtn_ary['total'] = $total;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
