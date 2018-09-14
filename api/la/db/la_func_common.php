<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/8/14
 * Time: 下午12:17
 */

function la_user_check($token)
{

    $key = Config::TOKEN_KEY;
// 获取token并解密
    $des = new Des();
    $decryption_code = $des -> decrypt($token, $key);
    $now_time = time();
    $code_conf =  explode(',',$decryption_code);

    if(!isset($code_conf[0])||!isset($code_conf[1]))
        exit_error('114','Token timeout please retrieve!');
// 获取token中的需求信息
    $user = $code_conf[0];
    $timestamp = $code_conf[1];

    if($timestamp < $now_time){
        exit_error('114','Token timeout please retrieve!');
    }

//判断la是否存在
    $row = get_la_by_user($user);
    if(!$row){
        exit_error('120','用户不存在');
    }

    return $user;

}



/**
 * @param $length
 * @return string
 * 获取length位随机数
 */
function random_num_chars($length)
{

    $string = '8a5b2de3fh4iyjl9mcnp0k6qrs7tuvow1xgz';


    $res = '';
    for ($i = 0 ; $i<$length;$i++){
        $random = rand(0,35);
        $res .= substr($string,$random,1);
    }

    return $res;


}

/**
 * @return array|string
 * 获取毫秒时间戳
 */
function mtimer(){

    $time = explode (" ", microtime () );
    $time = $time [1] . ($time [0] * 1000);
    $time2 = explode ( ".", $time );
    $time = $time2 [0];
    return $time;

}