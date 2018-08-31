<?php
header("cache-control:no-cache,must-revalidate");
header("Content-type:text/html;charset=utf-8");

// 结束
function callback($code = '-1', $msg = '', $src = '')
{
  $rtn_ary = array();
  $rtn_ary['code'] = $code;
  $rtn_ary['msg'] = $msg;

  if ($code == 0) {
    $rtn_ary['data'] = array();
    $rtn_ary['data']['src'] = $src;
  }

  $rtn_str = json_encode($rtn_ary);
  if (isset($_GET['callback'])) {
    $callback = $_GET['callback'];
    exit("{$callback}({$rtn_str});");
  } else {
    exit($rtn_str);
  }
}

// 允许上传文件后缀
$allowedExtensions = array('jpg', 'png', 'bmp','gif','jpeg');
$sizeLimit = 10 * 1024 * 1024;

// 上传文件为空
if (empty($_FILES['file']))
  callback('-1', '上传文件为空');

$success = 0;
$paths = array();

$filename = $_FILES["file"]["name"];

// 检查文件类型和大小
$ext = explode('.', basename($filename));
$ext = array_pop($ext);
if (!in_array(strtolower($ext), $allowedExtensions))
  callback('-1', '不支持该文件类型上传');
if ($_FILES["file"]["size"] > $sizeLimit)
  callback('-1', '单个文件大小不得超过10M');


// 定义新文件名
$ext = explode('.', basename($filename));
$target = "images" . DIRECTORY_SEPARATOR . md5(uniqid()) . "." . array_pop($ext);
// 移动文件至新文件夹
if(move_uploaded_file($_FILES["file"]["tmp_name"], $target)) {
    $success = 1;
    $paths[] = $target;
} else {
    $success = 2;
}

// 没有文件上传
if ($success == 0)
    callback('-1', '没有文件被上传');

// 文件上传失败
if ($success == 2) {
    // 删除上传文件
    foreach ($paths as $file) {
        unlink($file);
    }
    callback('-1', '文件上传失败');
}

// 输出内容
callback(0, '', Config::CONFORM_URL_file.'/upload/' . $target);
?>
