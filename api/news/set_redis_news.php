<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/10/9
 * Time: 下午1:30
 * la后台添加新闻
 */


require_once "../inc/common.php";

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");


$db = new DB_COM();
$redis = new Rediscache();
$sql = "select * from la_news order BY ctime DESC";
$db->query($sql);
$rows = $db->fetchAll();
if ($rows){
    foreach ($rows as $k=>$v){
        $url = news_address."/news/".$v['news_id'].".html";
        $shorturl = get_shorturl($url);
        if ($shorturl['errmsg']='ok'){
            $url = $shorturl['short_url'];
        }
        $date = date('Y-m-d H:i:s');
        $sql = "update la_news set url='{$url}',utime='{$date}' WHERE news_id='{$v['news_id']}'";
        $db->query($sql);
        $redis->rPush('static_news',json_encode($rows[$k],true));
    }
}


