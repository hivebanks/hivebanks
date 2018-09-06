<?php
/**
 * Created by PhpStorm.
 * User: liangyi
 * Date: 2018/9/6
 * Time: 下午4:06
 */

function send_sms_by_agent_service($cellphone,$code,$la_id){
    $url = "http://agent_service.fnying.com/sms/sms_send.php";
    $post_data = array();
    $post_data["cellphone"] = $cellphone;
    $post_data["code"] = $code;
    $post_data["la_id"] = $la_id;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
    $output = curl_exec($ch);
    curl_close($ch);
    $output_array = json_decode($output, true);

    return $output_array;
}