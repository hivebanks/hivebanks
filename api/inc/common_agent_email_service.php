<?php
/**
 * Created by PhpStorm.
 * User: liangyi
 * Date: 2018/9/6
 * Time: 下午4:06
 */

function send_email_by_agent_service($email,$title,$body,$la_id){
    $url = "http://agent_service.fnying.com/email/send_email.php";
    $post_data = array();
    $post_data["email"] = $email;
    $post_data["title"] = $title;
    $post_data['body'] = $body;
    $post_data["key_code"] = $la_id;
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
    $output = curl_exec($ch);
    curl_close($ch);
    print_r($output);
    print_r(777);
    $output_array = json_decode($output);
    print_r(888);
    print_r($output_array);
    return $output_array;
}