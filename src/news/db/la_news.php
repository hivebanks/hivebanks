<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/10/11
 * Time: 上午9:54
 */


/**
 * @return array
 * 新闻列表@todo 分页
 */
function news_list(){
    $db = new DB_COM();
    $sql = "select title,author,utime,ctime,news_id from la_news where status = 1 order by ctime desc";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}

/**
 * @param $news_id
 * @return array
 * 新闻详情
 */
function news_detail($news_id){
    $db = new DB_COM();
    $sql = "select * from la_news where status = 1 and  news_id = '{$news_id}' ";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}