<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/10/9
 * Time: 下午1:30
 * la后台新闻列表
 */



require_once "../../../inc/common.php";
require_once "db/la_news.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

php_begin();
$args = array("token");
chk_empty_args('GET', $args);
$data = array();
// 用户token
$token = get_arg_str('GET', 'token', 128);

la_user_check($token);

$list = news_list();
if($list)
    exit_ok($list);
exit_error('-1','获取新闻列表失败');