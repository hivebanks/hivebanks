<?php


require_once "common.php";
require_once "es_imagecls.php";
//namespace Aliyun;
if (is_file( '../plugin/OSS/autoload.php')) {
    require_once '../plugin/OSS/autoload.php';
}

ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);
use \OSS\OssClient;

use \OSS\Core\OssException;
$accessKeyId = "LTAIuTfkvjnNg54j";
$accessKeySecret = "OTETap8a971xgfYdNCawWuHTkbR5dj";
// Endpoint以杭州为例，其它Region请按实际情况填写。
$endpoint = "oss-cn-beijing.aliyuncs.com";
// 存储空间名称
$bucket = "hivebanks";
//$object = "example.jpg";
//$content = "/example.jpg";
//$file = $_FILES["file"];
//print_r($file['file']);
//$file_path = dirname(__FILE__);
//$filename = $_FILES["file"]["name"];
//$ext = explode('.', basename($filename));
//$target = "img" . DIRECTORY_SEPARATOR . md5(uniqid()) . "." . array_pop($ext);
//$key = "file";
//$img_result = save_image_upload($_FILES, $key, "temp");
//print_r($img_result);

//$scr = $_FILES['file']['tmp_name'];
//
//$ext = substr($_FILES['file']['name'],strrpos($_FILES['file']['name'],'.')+1); // 上传文件后缀
//
//$dst = md5(time()).'-'.$scr.'.'.$ext;     //上传文件名称
//
//
//
//$data = array('url' =>$url);
//
//$this->response(0,'上传成功',$data);

$scr = $_FILES['file']['tmp_name'];

$ext = substr($_FILES['file']['name'],strrpos($_FILES['file']['name'],'.')+1); // 上传文件后缀

$dst = md5(time()).'-'.$scr.'.'.$ext;

try {
    $ossClient = new \OSS\OssClient($accessKeyId, $accessKeySecret, $endpoint);
    $data = $ossClient->uploadFile($bucket, $dst, $scr);
    print_r($data['info']['url']);

} catch (\OSS\Core\OssException $e) {
    print $e->getMessage();

}




function save_image_upload($upd_file, $key = '', $dir = 'temp', $whs = array(), $is_water = false, $need_return = true)
{
    $image = new es_imagecls();
    $image->max_size = intval(10000000);

    $list = array();

    if (empty($key)) {
        foreach ($upd_file as $fkey => $file) {
            $list[$fkey] = false;
            $image->init($file, $dir);
            if ($image->save()) {
                $list[$fkey] = array();
                $list[$fkey]['url'] = $image->file['target'];
                $list[$fkey]['path'] = $image->file['local_target'];
                $list[$fkey]['name'] = $image->file['prefix'];
            } else {
                if ($image->error_code == -105) {
                    return array('status' => 0, 'error' => '上传的图片太大');
                } elseif ($image->error_code == -104 || $image->error_code == -103 || $image->error_code == -102 || $image->error_code == -101) {
                    return array('status' => 0, 'error' => '非法图像' . $image->error_code);
                }
            }
        }
    } else {
        $list[$key] = false;
        $image->init($upd_file[$key], $dir);
        if ($image->save()) {
            $list[$key] = array();
            $list[$key]['url'] = $image->file['target'];
            $list[$key]['path'] = $image->file['local_target'];
            $list[$key]['name'] = $image->file['prefix'];
        } else {
            if ($image->error_code == -105) {
                return array('status' => 0, 'error' => '上传的图片太大');
            } elseif ($image->error_code == -104 || $image->error_code == -103 || $image->error_code == -102 || $image->error_code == -101) {
                return array('status' => 0, 'error' => '非法图像' . $image->error_code);
            }
        }
    }
    return $list;
}