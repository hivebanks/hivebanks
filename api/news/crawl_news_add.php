<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/10/9
 * Time: 下午1:30
 * la后台添加新闻
 */


require_once "../inc/common.php";
require_once "db/la_news.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");


php_begin();

$args = array("title","content","author");
chk_empty_args('POST', $args);
$data = array();

$data['news_id']  = get_guid();
$data['title']  = get_arg_str('POST', 'title', 128);
$data['content']  = get_arg_str('POST', 'content', 999999999);
$data['author']  = get_arg_str('POST', 'author', 128);
$data['category']  = 2;

if(news_add($data))
    exit_ok();
exit_error('-1','添加失败');


