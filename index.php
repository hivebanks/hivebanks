<?php 
$url = $_SERVER['SERVER_NAME']."/h5";
header("Location: $url"); 
//确保重定向后，后续代码不会被执行 
exit;
