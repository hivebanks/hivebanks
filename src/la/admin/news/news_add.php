<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/10/9
 * Time: 下午1:30
 * la后台添加新闻
 */


require_once "../../../inc/common.php";
require_once "db/la_news.php";
require_once "../manage/db/la_admin.php";
require_once "../../db/la_func_common.php";
require_once "../../../inc/common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");


php_begin();

$args = array("token","title","content","author");
chk_empty_args('POST', $args);
$data = array();
// 用户token
$token = get_arg_str('POST', 'token', 128);
$data['news_id']  = get_guid();
$data['title']  = get_arg_str('POST', 'title', 128);
$data['content']  = get_arg_str('POST', 'content', 999999999);
$data['author']  = get_arg_str('POST', 'author', 128);

la_user_check($token);

if(news_add($data))
    exit_ok();
exit_error('-1','添加新闻失败');


