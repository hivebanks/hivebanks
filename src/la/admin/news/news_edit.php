<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/10/9
 * Time: 下午1:30
 * la后台更新新闻
 */


require_once "../../../inc/common.php";
require_once "db/la_news.php";
require_once "../manage/db/la_admin.php";
require_once "../../db/la_func_common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");


php_begin();
$args = array("token","title","content","author","news_id");
chk_empty_args('GET', $args);
$data = array();
// 用户token
$token = get_arg_str('GET', 'token', 128);
$data['title'] = get_arg_str('GET', 'title', 128);
$data['content'] =  get_arg_str('GET', 'content', 128);
$data['author'] = get_arg_str('GET', 'author', 128);
$data['news_id'] = get_arg_str('GET', 'news_id', 128);

la_user_check($token);

if(news_edit($data))
    exit_ok();
exit_error('-1','更新新闻失败');