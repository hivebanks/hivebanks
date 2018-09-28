<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/9/18
 * Time: 下午2:49
 */

set_time_limit(0);


//读取properties文件
$n = 0;
$data = file('index.properties');
foreach ($data as $k => $v){
    $dbMatched = preg_match("/=/",$v,$matches);
    if($matches){
        $count_equal = preg_match("/==/",$v,$matches);
        if(!$matches){//剔除注释

            //匹配右边已翻译单词
            $serverMatched = preg_match("/=.*/", $v, $matches);
            if($matches) {
                //匹配左边待翻译单词
                $leftMatched = preg_match("/.*=/", $v, $matches_left);
                $leftWord = $matches_left[0];

                $data = str_replace('=','',$matches[0]);

                //处理待翻译文字，如果有特殊符号，则依次翻译并写入文件

                $appid='*';
                $salt='*';
                $key = '*';
                $q = $data;
                $sign = md5($appid.$q.$salt.$key);

                //调用翻译接口，q=右侧中文

                $api = "http://api.fanyi.baidu.com/api/trans/vip/translate?q=$q&from=zh&to=jp&appid=$appid&salt=1435660288&sign=$sign";

                $response = file_get_contents($api);
                if($response) {
                    $response_arr = json_decode($response, 1);

                    if (isset($response_arr['trans_result'])) {
                        if (isset($response_arr['trans_result'][0]) && !empty($response_arr['trans_result'][0]['dst'])) {
                            $dst = $response_arr['trans_result'][0]['dst'];
//                        var_dump($dst);die;
                            //构造新翻译等式
                            $translation_new = '';
                            $translation_new = $leftWord . $dst;

                            //写入新文件
                            file_put_contents('index_ja_new.properties', $translation_new . "\r", FILE_APPEND);
                        }
                    }
                }else{
                    file_put_contents('index_ja_new.properties', $leftWord .'|||||||||||||'.$q. "\r", FILE_APPEND);
                }
            }
        }else{//处理注释

            file_put_contents('index_ja_new.properties', "\r".$v."\r", FILE_APPEND);

        }
    }else{//如果没有等号，视为注释
        file_put_contents('index_ja_new.properties', "\r".$v."\r", FILE_APPEND);
    }
    echo $n++;
    sleep(5);
}
//var_dump($data);
//正则提取带翻译单词，调用api

//写入properties文件