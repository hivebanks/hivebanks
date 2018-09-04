<?php
ini_set('date.timezone','Asia/Shanghai');
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

header('Access-Control-Allow-Origin:*');
// 响应类型
header('Access-Control-Allow-Methods:POST');
// 响应头设置
header('Access-Control-Allow-Headers:x-requested-with,content-type');


require_once('config.php');
require_once('log.php');
require_once('mysql.php');
require_once('db_connect.php');
require_once('des.php');
//======================================
// 函数: GET/POST必须参数是否为空检查
// 参数: $type          GET或POST
// 参数: $args          需检查的参数数组
// 返回: 无
// 说明: 若参数有一个为空则直接异常退出
//======================================
function chk_empty_args($type = 'GET', $args)
{
  if (Config::AUTO_TEST_FLAG)
    return;

  if (empty($type))
    exit_error();

  if ($type != 'GET' AND $type != 'POST')
    exit_error();

  foreach ($args as $arg) {
    $arg_str = '';

    if ($type == 'GET' && isset($_GET[$arg]))
      $arg_str = trim($_GET[$arg]);

    if ($type == 'POST' && isset($_POST[$arg]))
      $arg_str = trim($_POST[$arg]);

    if (empty($arg_str))
      exit_error('120', "{$arg} {$type} parameter is empty");
  }
  return;
}

//======================================
// 函数: 获取GET/POST的参数，添加反斜杠处理
// 参数: $type          GET或POST
// 参数: $arg           参数
// 参数: $max_len       最大长度（默认50）
// 返回: 处理后的参数
// 说明:
//======================================
function get_arg_str($type, $arg, $max_len = 100)
{
  if (Config::AUTO_TEST_FLAG)
    return get_test_arg($arg);

  $arg_str = '';
  if ($type == 'GET' && isset($_GET[$arg]))
    $arg_str = substr(trim($_GET[$arg]), 0, $max_len);

  if ($type == 'POST' && isset($_POST[$arg]))
    $arg_str = substr(trim($_POST[$arg]), 0, $max_len);

  // PHP已开启自转义
  if (get_magic_quotes_gpc())
    return $arg_str;

  return addslashes($arg_str);
}


//======================================
// 函数: 取得分页相关参数(limit, offset)
// 参数: $type          GET或POST
// 返回: array($limit, $offset)
// 说明: 分页相关参数(limit, offset)处理
//======================================
function get_paging_arg($type)
{
  $limit = Config::REC_LIMIT;
  $offset = 0;
  if ($type == 'GET' && isset($_GET['limit']))
    $limit = intval($_GET['limit']);
  if ($type == 'POST' && isset($_POST['limit']))
    $limit = intval($_POST['limit']);
  if ($type == 'GET' && isset($_GET['offset']))
    $offset = intval($_GET['offset']);
  if ($type == 'POST' && isset($_POST['offset']))
    $offset = intval($_POST['offset']);

  $limit = min($limit,Config::REC_LIMIT_MAX);

  return array($limit, $offset);
}

//======================================
// 函数: 取得下拉列表选项
// 参数: $list          全体列表数组
// 参数: $select        默认选择项目
// 返回: 下拉列表选项
// 说明:
//======================================
function get_select_option($list, $select)
{
  $option = '';
  foreach ($list as $key=>$val) {
    if ($key == $select) {
      $option .= '<option value="' . $key . '" selected="selected">' . $val . '</option>';
    } else {
      $option .= '<option value="' . $key . '">' . $val . '</option>';
    }
  }
  return $option;
}

//======================================
// 函数: 取得单选框列表选项
// 参数: $name          控件名
// 参数: $list          全体列表数组
// 参数: $checked       默认选择项目
// 返回: 下拉列表选项
// 说明:
//======================================
function get_radio_input($name, $list, $checked)
{
  $input = '';
  foreach ($list as $key=>$val) {
    if ($key == $checked) {
      $input .= '<input type="radio" name="' . $name . '" value="' . $key . '" title="' . $val . '" checked>';
    } else {
      $input .= '<input type="radio" name="' . $name . '" value="' . $key . '" title="' . $val . '">';
    }
  }
  return $input;
}

//======================================
// 函数: 将用户输入内容转型放入数据库(HTML代码无效)
// 参数: $value         处理字符集
// 返回: 转型后字符集
//======================================
function str_to_html($value) {

  $rtn_str = '';

 if (isset($value)) {
    $rtn_str = str_replace("<", "&lt;", $value);
    $rtn_str = str_replace(">", "&gt;", $rtn_str);
    $rtn_str = str_replace(chr(34), "&quot;", $rtn_str);
    $rtn_str = str_replace(chr(13), "<br>", $rtn_str);
    $rtn_str = str_replace("\n", "<br>", $rtn_str);
    $rtn_str = str_replace(chr(9), "　　　　", $rtn_str);
  }

  return $rtn_str;
}

//======================================
// 函数: 将用户输入内容转型放入数据库(HTML代码有效)
// 参数: $value         处理字符集
// 返回: 转型后字符集
//======================================
function str_to_html_able($value) {

  $rtn_str = '';

 if (isset($value)) {
    $rtn_str = str_replace(chr(34), "&quot;", $value);
    $rtn_str = str_replace(chr(13), "<br>", $rtn_str);
    $rtn_str = str_replace("\n", "<br>", $rtn_str);
    $rtn_str = str_replace(chr(9), "　　　　", $rtn_str);
  }

  return $rtn_str;
}

//======================================
// 函数: 将数据库存放的用户输入内容转换回再修改内容
// 参数: $value         处理字符集
// 返回: 转型后字符集
//======================================
function html_to_str($value) {

  $rtn_str = '';

 if (isset($value)) {
    $rtn_str = str_replace("&nbsp;", " ", $value);
    $rtn_str = str_replace("&lt;", "<", $rtn_str);
    $rtn_str = str_replace("&gt;", ">", $rtn_str);
    $rtn_str = str_replace("&quot;", chr(34), $rtn_str);
    $rtn_str = str_replace("<br>", chr(13), $rtn_str);
    $rtn_str = str_replace("<br />", chr(13), $rtn_str);
    $rtn_str = str_replace("<br/>", chr(13), $rtn_str);
    $rtn_str = str_replace("&#32;", chr(9), $rtn_str);
  }

  return $rtn_str;
}

//======================================
// 函数: 取得唯一标示符GUID
// 参数: 无
// 返回: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX（8-4-4-4-12，共36位）
// 说明: 随机数前缀+根据当前时间生成的唯一ID转成大写的MD5码
// 说明: 32位重排+分隔符4位生成36位GUID
//======================================
function get_guid()
{
  $charid = strtoupper(md5(uniqid(mt_rand(), true)));
  $hyphen = chr(45);  // "-"
  $uuid = substr($charid, 6, 2).substr($charid, 4, 2).substr($charid, 2, 2).substr($charid, 0, 2).$hyphen;
  $uuid .= substr($charid, 10, 2).substr($charid, 8, 2).$hyphen;
  $uuid .= substr($charid,14, 2).substr($charid,12, 2).$hyphen;
  $uuid .= substr($charid,16, 4).$hyphen;
  $uuid .= substr($charid,20,12);
  return $uuid;
}

//======================================
// 函数: 返回当前URL
// 参数: 无
// 返回:
//======================================
function get_url()
{
  $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
  return $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
}

//======================================
// 函数: 取得用户访问IP
// 参数: 无
// 返回: XXX.XXX.XXX.XXX
// 返回:
//======================================
function get_ip()
{
  $ip=false;
  if (!empty($_SERVER["HTTP_CLIENT_IP"])) {
    $ip = $_SERVER["HTTP_CLIENT_IP"];
  }
  if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ips = explode (", ", $_SERVER['HTTP_X_FORWARDED_FOR']);
    if($ip) {
      array_unshift($ips, $ip);
      $ip = FALSE;
    }
    for($i = 0; $i < count($ips); $i++) {
      if (!preg_match("/^(10|172\.16|192\.168)\./", $ips[$i])) {
        $ip = $ips[$i];
        break;
      }
    }
  }
  return($ip ? $ip : $_SERVER['REMOTE_ADDR']);
}

//======================================
// 函数: 取得用户访问IP的长整数
// 参数: 无
// 返回: IP地址对应的长整数
// 返回: 若无法取得返回 0
//======================================
function get_int_ip()
{
  $ip = ip2long(get_ip());
  if ($ip)
    return $ip;
  return 0;
}

//======================================
// 函数: 将日志里面的数组或JSON数据转成可识别的字符串形式
// 功能: 如果是JSON数据先转成数组形式
// 功能: 如果是数组则直接转成字符串形式
// 功能: 否则直接返回
// 参数: $rtn_data      需转换的数据
// 返回: 数组和JSON转成{"key1":"value1","key2":"value2"} 形式的字符串
//======================================
function get_log_msg_str($rtn_data)
{
  $rtn_arry = $rtn_data;
  // 非数组则尝试转成数组格式
  if (!is_array($rtn_arry)) {
    $rtn_arry = json_decode($rtn_data, true);
    // 转换结果为空数组或非数组则直接返回原有结果
    if (empty($rtn_arry) || !is_array($rtn_arry))
      return $rtn_data;
  }

  $buff = "";
  foreach ($rtn_arry as $k => $v) {
    if (!is_array($v)) {
      $buff .= '"' . $k . '":"' . $v . '",';
    } else {
      $buff .= '"' . $k . '":' . get_log_msg_str($v) . ',';
    }
  }

  $buff = trim($buff, ",");
  return '{' . $buff . '}';
}

//======================================
// 函数: 禁止游客访问
// 参数: 无
// 返回: 无
// 说明: 若session中没有设置staff_id，直接退出
//======================================
function exit_guest()
{
  if (!session_id())
    session_start();

  if (!isset($_SESSION['staff_id']))
    exit('Login failure, please login again.');
}

//======================================
// 函数: 异常退出
// 参数: $errcode       错误代码（默认-1）
// 参数: $errmsg        错误信息（默认系统繁忙，稍候再试）
// 返回: 无
// 说明: 返回异常退出的json数据
//======================================
function exit_error($errcode = '-1', $errmsg = '')
{
  // 未设置错误信息
  if (empty($errmsg)) {
    // 通用错误码
    switch ($errcode) {
    case '90':
        $errmsg = '活动尚未开始，请耐心等待';
        break;
    case '100':
        $errmsg = '活动已经结束，感谢您的参与';
        break;
    case '101':
        $errmsg = '登录验证失败，请重新登录';
        break;
    case '110':
        $errmsg = '服务异常中断，请与管理员联系';
        break;
    case '114':
        $errmsg = '登录已过期，请重新登录';
        break;
    case '119':
        $errmsg = '登录已失效，请重新登录';
        break;
    case '120':
        $errmsg = '参数错误';
        break;
    case '130':
        $errmsg = '禁止操作';
        break;
    case '140':
        $errmsg = 'ID不存在';
        break;
    case '150':
        $errmsg = '数字签名错误';
        break;
    case '190':
        $errmsg = '未知错误';
        break;
    default:
        $errmsg = '系统繁忙，稍候再试';
        break;
    }
  }

  $rtn_ary = array();
  $rtn_ary['errcode'] = $errcode;
  $rtn_ary['errmsg'] = $errmsg;
  $rtn_str = json_encode($rtn_ary);
  php_end($rtn_str, Config::WARN_LEVEL);
}

//======================================
// 函数: 正常退出
// 参数: $msg         正常退出信息（默认空）
// 返回: 无
// 说明: 返回正常退出的json数据
//======================================
function exit_ok($msg='')
{
  $rtn_ary = array();
  $rtn_ary['errcode'] = '0';
  $rtn_ary['errmsg'] = $msg;
  $rtn_str = json_encode($rtn_ary);
  php_end($rtn_str);
}
function exit_succress($data,$msg = '')
{
    $rtn_ary = array();
    $rtn_ary['errcode'] = '0';
    $rtn_ary['errmsg'] = $msg;
    $rtn_ary["row"] = $data;
    $rtn_str = json_encode($rtn_ary);
    php_end($rtn_str);
}
//======================================
// 函数: PHP程序运行开始处理
// 参数: $log_level   日志等级(1跟踪，2 正常，4警告，8异常)
// 返回: 无
// 说明: PHP运行开始，日志等级默认1跟踪
//======================================
function php_begin($log_level = Config::DEBUG_LEVEL)
{
//  // LOG日志是否执行判定
//  if (Config::PHP_LOG_LEVEL > 0) {
//    // 初始化PHP运行日志
//      $log_file =  Config::PHP_LOG_FILE_PREFIX . date('Y-m-d') . '.log';
//
//    $logHandler = new LogFileHandler($log_file);
//    $log = Log::Init($logHandler, Config::PHP_LOG_LEVEL);
//    // 记录信息，调用程序，用户IP，调用参数
//    $msg = $_SERVER['PHP_SELF'] . " IP:" . get_ip() . " Get:" . get_log_msg_str($_GET) . " Post:" . get_log_msg_str($_POST);
//
//    switch($log_level)
//    {
//      // 记录正常日志
//      case Config::INFO_LEVEL:
//        // 日志记录正常日志
//        Log::INFO($msg);
//        break;
//      // 记录跟踪日志
//      default:
//        // 日志记录跟踪日志
//        Log::DEBUG($msg);
//        break;
//    }
//  }
  return;
}

//======================================
// 函数: PHP程序运行结束处理
// 参数: $rtn_data    返回信息(ApiRtnData类)
// 参数: $log_level   日志等级(1跟踪，2 正常，4警告，8异常)
// 返回: $rtn_data
// 说明: PHP运行结束处理，日志等级默认1跟踪
//======================================
function php_end($rtn_data, $log_level = Config::DEBUG_LEVEL)
{

//    // LOG日志是否执行判定
//  if (Config::PHP_LOG_LEVEL > 0) {
//    // 初始化PHP运行日志
//      $log_file =  Config::PHP_LOG_FILE_PREFIX . date('Y-m-d') . '.log';
//    $logHandler = new LogFileHandler($log_file);
//    $log = Log::Init($logHandler, Config::PHP_LOG_LEVEL);
//    // 记录信息，调用程序，用户IP，返回数据
//    $msg = $_SERVER['PHP_SELF'] . " IP:" . get_ip() . " Rtn:" . get_log_msg_str($rtn_data);
//
//    switch($log_level)
//    {
//      // 记录异常日志
//      case Config::ERROR_LEVEL:
//        $beg_msg = $_SERVER['PHP_SELF'] . " IP:" . get_ip() . " Get:" . get_log_msg_str($_GET) . " Post:" . get_log_msg_str($_POST);
//        Log::ERROR($beg_msg);
//        Log::ERROR($msg);
//        break;
//      // 记录警告日志
//      case Config::WARN_LEVEL:
//        $beg_msg = $_SERVER['PHP_SELF'] . " IP:" . get_ip() . " Get:" . get_log_msg_str($_GET) . " Post:" . get_log_msg_str($_POST);
//        Log::WARN($beg_msg);
//        Log::WARN($msg);
//        break;
//      // 记录正常日志
//      case Config::INFO_LEVEL:
//        Log::INFO($msg);
//        break;
//      // 记录跟踪日志
//      default:
//        Log::DEBUG($msg);
//        break;
//    }
//  }

  if (isset($_GET['callback'])) {
    $callback = $_GET['callback'];
    exit("{$callback}({$rtn_data});");
  } else {
    exit($rtn_data);
  }


}

function getMillisecond(){
    list($s1,$s2)=explode(' ',microtime());
    return (float)sprintf('%.0f',(floatval($s1)+floatval($s2))*1000);
}


//======================================
// 函数: 验证token信息
// 参数: token,type:如果为空,只返回id,则返回所以
// 返回: id
// 说明: 若验证错误,直接返回错误信息
//======================================

function check_token($token,$type=''){
    $key = Config::TOKEN_KEY;
    // 获取token并解密
    $des = new Des();
    $decryption_code = $des -> decrypt($token, $key);
    $now_time = time();
    $code_conf =  explode(',',$decryption_code);
    if (count($code_conf) <= 1)
        exit_error('114','Token timeout please retrieve!');

    // 获取token中的需求信息
    $us_id = $code_conf[0];
    $timestamp = $code_conf[1];
    if($timestamp < $now_time){
        exit_error('114','Token timeout please retrieve!');
    }
    if ($type)
        return $code_conf;
    else
        return $us_id;
}

?>