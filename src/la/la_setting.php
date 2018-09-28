<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/7/30
 * Time: 上午11:22
 * 安装程序页面
 *
 * @step 安装步骤
 * ==1== 欢迎页面
 * ==2== 数据库信息填写
 * ==3== 后台管理员填写
 * ==4=  LA后台初始化配置
 * ==5== 回显配置信息，开始安装
 */

ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);
require_once 'db/la_func_config.php';
require_once 'db/la_func_common.php';
//require_once '../inc/common.php';




$step = $_REQUEST['step'];

switch ($step) {
    case 'reinstall':
        header('location:la_restart_confirm.php');
        break;

    case 'reinstall_flag':

        $reinstall_flag = random_num_chars(7);
        $email = $_REQUEST['email'];
        $pwd = $_REQUEST['pwd'];
        require_once  "../inc/common.php";
        require_once  "../inc/db_connect.php";

        $db = new DB_COM();
        $sql = "select * from la_admin where pwd = '{$pwd}' and email= '{$email}'";
        $db->query($sql);
        $res_admin = $db->fetchRow();
        if($res_admin) {
            $sql = "update la_admin set last_login_ip = '{$reinstall_flag}'";
            $db->query($sql);
            $res = $db->affectedRows();
            if ($res) {
                header("location:la_setting_step_one.php?reinstall_flag=$reinstall_flag");
                exit();
            }
        }
        header("location:la_restart_confirm.php");
        break;
    case '1':

        header('location:la_setting_step_one.php');

    break;

    case '2':
        $reinstall_flag = $_REQUEST['reinstall_flag'];
        header("location:la_setting_step_two.php?reinstall_flag=$reinstall_flag");

    break;

    case '3':
        $reinstall_flag = $_REQUEST['reinstall_flag'];
        $db_name = $_REQUEST['dbname'];
        $DB_COMer = $_REQUEST['uname'];
        $db_pwd  = $_REQUEST['pwd'];
        $db_host = $_REQUEST['dbhost'];

        //测试数据库链接
        $db_connect_check = db_connect_check($db_host,$DB_COMer,$db_pwd,$db_name);

        header("location:la_setting_step_three.php?dbname=$db_name&uname=$DB_COMer&pwd=$db_pwd&dbhost=$db_host&reinstall=$reinstall_flag");

    break;

    case '4':
        $reinstall_flag = $_REQUEST['reinstall_flag'];
        $db_name = $_REQUEST['db'];
        $DB_COMer = $_REQUEST['u'];
        $db_pwd  = $_REQUEST['p'];
        $db_host = $_REQUEST['s'];

        $db_check = before_install_check($db_host, $DB_COMer, $db_pwd,$db_name);
        //安装前确认数据库连接
        if($db_check) {
            header("location:la_setting_step_three.php?dbname=$db_name&uname=$DB_COMer&pwd=$db_pwd&dbhost=$db_host&reinstall=$reinstall_flag");
        }else{
            header('location:la_error_db_connect.php');
        }
    break;

    case '5':
        $reinstall_flag = $_REQUEST['reinstall_flag'];
        //构造uid
        $charid = strtoupper(md5(uniqid(mt_rand(), true)));
        $hyphen = chr(45);  // "-"
        $uuid = substr($charid, 6, 2).substr($charid, 4, 2).substr($charid, 2, 2).substr($charid, 0, 2).$hyphen;
        $uuid .= substr($charid, 10, 2).substr($charid, 8, 2).$hyphen;
        $uuid .= substr($charid,14, 2).substr($charid,12, 2).$hyphen;
        $uuid .= substr($charid,16, 4).$hyphen;
        $uuid .= substr($charid,20,12);

        //构造用户信息
        $data['user'] = $_REQUEST['user_name'];
        $data['pwd']  = $_REQUEST['admin_password'];
        $data['ctime']  = time();
        $data['pid'] = '1,2,3,4,5';
        $data['email'] = $_REQUEST['user_email'];
        $data['id'] = $uuid;


        $key_option = array();
        $key_option['option_name'] = 'api_key';
        $key_option['option_key'] = 'key';
        $key_option['option_value'] = random_num_chars(8);
        $key_option['option_sort'] = 0;
        $key_option['sub_id'] = 'COM';
        $key_option['status'] = 1;


        table_create($_REQUEST['dbhost'], $_REQUEST['uname'], $_REQUEST['pwd'],$_REQUEST['dbname']);

        admin_create($data,$_REQUEST['dbhost'], $_REQUEST['uname'], $_REQUEST['pwd'],$_REQUEST['dbname']);

        config_create($key_option,$_REQUEST['dbhost'], $_REQUEST['uname'], $_REQUEST['pwd'],$_REQUEST['dbname']);

        unit_expire_time('ba',$_REQUEST['dbhost'], $_REQUEST['uname'], $_REQUEST['pwd'],$_REQUEST['dbname']);

        unit_expire_time('ca',$_REQUEST['dbhost'], $_REQUEST['uname'], $_REQUEST['pwd'],$_REQUEST['dbname']);


        $db_name = $_REQUEST['dbname'];
        $DB_COMer = $_REQUEST['uname'];
        $db_pwd  = $_REQUEST['pwd'];
        $db_host = $_REQUEST['dbhost'];
        $user = $_REQUEST['user_name'];
        header("location:la_setting_step_four.php?u=$user&dbname=$db_name&uname=$DB_COMer&pwd=$db_pwd&dbhost=$db_host&reinstall_flag=$reinstall_flag");
    break;

    case '6':
        $reinstall_flag = $_REQUEST['reinstall_flag'];
        require_once '../inc/config.php';

        $key = Config::TOKEN_KEY;
        $user = $_REQUEST['u'];
        $data['benchmark_type'] = $_REQUEST['benchmark_type'];
        $data['api_url'] = $_REQUEST['api_url'];
        $data['h5_url'] = $_REQUEST['h5_url'];
        $data['digital_unit']  =$_REQUEST['digital_unit'];
        $data['ca_currency'] = $_REQUEST['ca_currency'];
        $data['userLanguage'] = isset($_COOKIE['userLanguage'])?(empty($_COOKIE['userLanguage'])?'en':$_COOKIE['userLanguage']):'en';
        set_ba_asset_unit($user,$data,$_REQUEST['dbhost'], $_REQUEST['uname'], $_REQUEST['pwd'],$_REQUEST['dbname']);

        header("location:la_give_me_five.php?u=$user&reinstall_flag=$reinstall_flag");
    break;

    case '7':
        $res = config_json_check($_REQUEST);
        $u = $_REQUEST['u'];
        if(!$res){
            $bt = $_REQUEST['bt'];
            $au = $_REQUEST['au'];
            $hu = $_REQUEST['hu'];
            $cc = $_REQUEST['cc'];
            $ul = $_REQUEST['ul'];
            header("location:la_error_permission_conf.php?au=$au&u=$u&bt=$bt&hu=$hu&cc=$cc&ul=$ul");
            exit;
        }
        header("location:la_give_me_five.php?u=$u&reinstall_flag=$reinstall_flag");
    break;
}



