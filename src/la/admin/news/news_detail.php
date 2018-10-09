<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/10/9
 * Time: 下午1:58
 * la后台新闻详情
 */


require_once "../../../inc/common.php";
require_once "db/la_news.php";
require_once "db/la_admin.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");


php_begin();
$args = array("token","news_id");
chk_empty_args('GET', $args);

// 用户token
$token = get_arg_str('GET', 'token', 128);
$news_id = get_arg_str('GET', 'news_id', 128);

la_user_check($token);

$news = news_detail($news_id);
if($news)
    exit_ok($news);
exit_error('-1','获取新闻详情失败');