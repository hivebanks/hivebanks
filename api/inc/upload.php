<?php
/**
 * Created by PhpStorm.
 * User: liangyi
 * Date: 2018/8/27
 * Time: 下午3:56
 */
namespace Qiniu;
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

require_once "../plugin/Qiniu/Auth.php";
//use Qiniu\Auth;
//use Qiniu\Storage\BucketManager;
//// 引入上传类
//use \Qiniu\Storage\UploadManager;
// 需要填写你的 Access Key 和 Secret Key
$accessKey = 'aegJ45Kcg4mVUTvpzGTA20SCF_gl2A-pONGTEyYb';
$secretKey = 'mYzXiGuWtfLVsqyyowW0rUjh3IIczb2GzoTmFelT';

// 构建鉴权对象
$auth = new Qiniu\Auth($accessKey, $secretKey);


//
///* 上传 */
////////////////////////////////////////////////////////////////////////////
//
//// 要上传的空间
//$bucket = 'richie';
//
////自定义上传回复的凭证 返回的数据
//$returnBody = '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(fname)"}';
//$policy = array(
//    'returnBody' => $returnBody,
//
//);
//////token过期时间
//$expires = 3600;
//
//// 生成上传 Token
//$token = $auth->uploadToken($bucket, null, $expires, $policy, true);
//
//// 要上传文件的本地路径
//$filePath = './img-08.jpg'; // 上传到七牛后保存的文件名，可拼接
//
//$key = 'img-08.jpg'; // 初始化 UploadManager 对象并进行文件的上传。
//
//$uploadMgr = new Qiniu\Storage\UploadManager(); // 调用 UploadManager 的 putFile 方法进行文件的上传。
//
//list($ret, $err) = $uploadMgr->putFile($token, $key, $filePath);
//
//// echo "\n====> putFile result: \n";
//
//if ($err !== null) {
//
//    var_dump($err);
//} else {
//
//    var_dump($ret);
//}