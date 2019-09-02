<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/10/9
 * Time: 下午1:31
 */

//新闻列表


require_once "../inc/common.php";
require_once "db/la_news.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

php_begin();

$list = category_list();
if ($list){
    foreach ($list as $k=>$v){
        switch ($v['category']){
            case 1:
                $list[$k]['category_name'] = "官方新闻";
                break;
            case 2:
                $list[$k]['category_name'] = "行业新闻";
                break;
            default:
                $list[$k]['category_name'] = "其他";
                break;
        }
        $list[$k]['list'] = get_news_list($v['category']);
    }
}
//获取最新的5条数据
$new_rows = get_new_five_news();
$rtn_ary = array();
$rtn_ary['errcode'] = '0';
$rtn_ary['errmsg'] = '';
$rtn_ary['rows'] = $list;
$rtn_ary['new_rows'] = $new_rows;
$rtn_str = json_encode($rtn_ary);
php_end($rtn_str);
