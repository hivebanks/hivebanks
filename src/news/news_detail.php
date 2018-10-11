<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/10/9
 * Time: 下午1:32
 */


require_once "../inc/common.php";
require_once "db/la_news.php";


header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");


php_begin();
$args = array("news_id");
chk_empty_args('GET', $args);

$news_id = get_arg_str('GET', 'news_id', 128);


$news = news_detail($news_id);
if($news){

    $rtn_ary = array();
    $rtn_ary['errcode'] = '0';
    $rtn_ary['errmsg'] = '';
    $rtn_ary['rows'] = $news;
    $rtn_str = json_encode($rtn_ary);

    php_end($rtn_str);

}

exit_error('-1','获取新闻详情失败');