<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/10/9
 * Time: 下午1:31
 */



require_once "../inc/common.php";
require_once "db/la_news.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

php_begin();

$list = news_list();
if($list){

    $rtn_ary = array();
    $rtn_ary['errcode'] = '0';
    $rtn_ary['errmsg'] = '';
    $rtn_ary['rows'] = $list;
    $rtn_str = json_encode($rtn_ary);
    php_end($rtn_str);
}

exit_error('-1','获取新闻列表失败');