<?php


require_once('mysql.php');
require_once('db_connect.php');
require_once('config_db_bind.php');

$config = get_token_key();
define('KEY', $config['option_value']);
$url_config = get_la_base_url();
define('SYSTEM_URL', $url_config['api_url']."/src");
define('H5_URL', $url_config['h5_url']);

define('BASE_UNIT', get_base_unit());

define('BASE_CURRENCY',get_base_currency());
if(!defined('APP_ROOT_PATH'))
    define('APP_ROOT_PATH', str_replace('inc/config.php', '', str_replace('\\', '/', __FILE__)));
// 配置信息类
class Config
{
    const OSS_DOMAIN = "http://hbapi.fnying.com";
    const OSS_FILE_DOMAIN = "http://hbapi.fnying.com";
    const OSS_BUCKET_NAME = 'hivebanks';
    const OSS_ACCESS_ID = 'LTAIuTfkvjnNg54j';
    const OSS_ACCESS_KEY = 'OTETap8a971xgfYdNCawWuHTkbR5dj';
    const OSS_ENDPOINT = 'hivebanks.oss-cn-beijing.aliyuncs.com';
    const OSS_ENDPOINT_WITH_BUCKET_NAME = true;
    const NEW_OSS = false;
    const OSS_DIR = 'img/';





  // 系统ID
  const SYSTEM_ID = '2';
  // 系统代号
  const SYSTEM_CD = 'user';
  // 确认URL
  const CONFORM_URL = SYSTEM_URL.'/user/cfm_email.php';
  //图片链接前缀
  const PHOTO_URL = SYSTEM_URL;
  //BA确认URL
  const BA_CONFORM_URL = SYSTEM_URL.'/ba/cfm_email.php';

  const CA_CONFORM_URL = SYSTEM_URL.'/ca/cfm_email.php';
//用户绑定注册邮箱
  const H5_US_URL_R = H5_URL.'/user/registerSuccess.html';
  const H5_US_URL_B = H5_URL.'/user/bindSuccess.html';
  //用户绑定注册邮箱
  const H5_BA_URL_R = H5_URL.'/ba/BaRegisterSuccess.html';
  const H5_BA_URL_B = H5_URL.'/ba/BaBindSuccess.html';
//用户绑定注册邮箱
  const H5_CA_URL_R = H5_URL.'/ca/CaRegisterSuccess.html';
  const H5_CA_URL_B = H5_URL.'/ca/CaBindSuccess.html';

    //文件上传url
  const CONFORM_URL_file= SYSTEM_URL;
  // 使用测试数据调试区分（false 使用正式数据 true 使用测试数据）

  const AUTO_TEST_FLAG = false;

  const LA_LOGIN_URL = H5_URL.'/la/login.html';
  // 跟踪日志等级
  const DEBUG_LEVEL = 1;
  // 信息日志等级
  const INFO_LEVEL = 2;
  // 警告日志等级
  const WARN_LEVEL = 4;
  // 异常日志等级
  const ERROR_LEVEL = 8;
  // PHP日志等级(0关闭，15全部, 14关闭跟踪日志)
  const PHP_LOG_LEVEL = 14;
  // PHP日志文件目录加前缀
//$dir_path = dirname(dirname(dirname(dirname(__FILE__))))."/h5_hivebanks/";

  const PHP_LOG_FILE_PREFIX = '/alidata/log/hivebanks/';

    // token key
  const TOKEN_KEY = KEY;

    // 前端url
    const H5_URL = H5_URL;

    // 一次读取记录条数
  const REC_LIMIT = 10;
  // 一次最多读取记录条数
  const REC_LIMIT_MAX = 100;
  // 每页显示记录条数
  const PAGESIZE = 10;
  // API调用超时
  const API_TIMEOUT = 30;

  const project_dictory = __DIR__;

  const BTC_CONG = 100000000;



}
?>