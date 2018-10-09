<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/10/9
 * Time: 下午1:30
 * la后台删除新闻
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

if(news_delete($news_id))
    exit_ok();
exit_error('-1','删除新闻失败');