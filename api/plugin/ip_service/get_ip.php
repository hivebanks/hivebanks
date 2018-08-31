<?php
//======================================
// 参数: us_ip                          用戶ip
// 返回: result['data']['location']    ip地址所屬區域
//======================================
function getIpInfo($us_ip){
    if(empty($us_ip));

    $url = "https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query=".$us_ip."&co=&resource_id=6006&t=1534396669452&ie=utf8&oe=gbk&cb=op_aladdin_callback&format=json&tn=baidu&cb=jQuery110207126151679006834_1534396644758&_=1534396644768";
    $result = file_get_contents($url);
    $result = json_decode($result,true);
    if($result['status']!==0 || !is_array($result['data'])){
        return false;
    }else{
        return $result['data']['location'];
    }
}