<?php

if (is_file(__DIR__ . '/autoload.php')) {
    require_once __DIR__ . '/autoload.php';
}
if (is_file(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';
}

ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);
print_r(333);
use OSS\OssClient;
use OSS\Core\OssException;
print_r(444);
$accessKeyId = "LTAIuTfkvjnNg54j";
$accessKeySecret = "OTETap8a971xgfYdNCawWuHTkbR5dj";
// Endpoint以杭州为例，其它Region请按实际情况填写。
$endpoint = "oss-cn-beijing.aliyuncs.com";
// 存储空间名称
$bucket = "hivebanks";
print_r(555);
$object = "img";
$content = "Hi, OSS.";
try {
    print_r(66);
    $ossClient = new OssClient($accessKeyId, $accessKeySecret, $endpoint);
    print_r($ossClient);
    $ossClient->putObject($bucket, $object, $content);
    print_r(22);
} catch (OssException $e) {
    print $e->getMessage();
    print_r(11);
}