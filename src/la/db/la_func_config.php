<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/7/29
 * Time: 下午7:57
 */

/*
 * 执行建表语句
 */


function excute_sql_file($sql, $server, $user, $password, $dbname)
{
    $conn = new mysqli($server, $user, $password, $dbname);
    if ($conn->connect_error) {
        header('location:la_error_db_connect.php');
        exit;
    }
    $sql = file_get_contents($sql);
    $array_sql = explode(";", $sql);
    $lenth = count($array_sql) - 1;
    unset($array_sql[$lenth]);//$array_sql[$lenth] == '';
    foreach ($array_sql as $array_sql_single) {
        if ($array_sql_single) {
            $sql_string = $array_sql_single . ";";
            $res = $conn->query($sql_string);
            if ($res !== true)
                return false;
        }
    }
    return true;

}

/**
 * @return boolean
 * 创建银行表格
 */
function table_create($server, $user, $password, $dbname)
{
    $sql_file = 'db/la_tables.sql';
    if (file_exists($sql_file)) {
        $res = excute_sql_file($sql_file, $server, $user, $password, $dbname);
        if ($res)
            return true;
    }

}

/**
 * @return boolean
 * 检查install.php文件是否存在，如果不存在则跳转登陆页面，否，进入安装程序；
 */
function install_file_check($file_name)
{

    if (file_exists($file_name))
        return true;
    else
        return false;
}


/**
 * @param $server
 * @param $user
 * @param $password
 * @param $database
 * @return bool
 * 测试数据库链接
 */
function db_connect_check($server, $user, $password, $database)
{
    $conn = @mysqli_connect($server, $user, $password);
    if ($conn->connect_error||!@$conn) {
        header('location:la_error_db_connect.php');
        exit;
    }



    $sql = "CREATE DATABASE " . $database . ' CHARACTER SET utf8 COLLATE utf8_general_ci';
    if ($conn->query($sql)) {
        $str_tmp = "<?php\r\n"; //得到php的起始符。$str_tmp将累加
        $str_end = "?>";
        $str_tmp .= "class DB_COM extends Mysql {\n";
        $str_tmp .= "public $" . "schema = '$database';\n";
        $str_tmp .= "protected $" . "server = '$server';\n";
        $str_tmp .= "protected $" . "user = '$user';\n";
        $str_tmp .= "protected $" . "password = '$password';\n";
        $str_tmp .= "protected $" . "database = '$database';\n";
        $str_tmp .= "protected $" . "character = 'utf8mb4';\n";
        $str_tmp .= "}";
        $str_tmp .= $str_end; //加入结束符

        $dir_path = dirname(dirname(dirname(__FILE__)))."";
        $sf = $dir_path."/inc/db_connect.php"; //文件名

        $fp = @fopen($sf, "w+");
        if(!$fp){//建库成功，写入失败，进入提示页面=>手动创建db文件
            header("location:la_error_permission_dbfile.php?dn=$database&s=$server&u=$user&p=$password&dn=$database");
            exit;
        }
        if(!@fwrite($fp, $str_tmp)){
            header("location:la_error_permission_dbfile.php?dn=$database&s=$server&u=$user&p=$password&dn=$database");
            exit;
        }

        fclose($fp);
        return true;
    } else {//如果建库失败，进入提示页面=>手动建库，手动创建db文件

        header("location:la_error_permission_dbfilesit.php?dn=$database&s=$server&u=$user&p=$password&dn=$database");
        exit;

    }

}


/**
 * @param $data
 * @return bool
 */
function admin_create($data, $server, $user, $password, $dbname)
{
    $conn = new mysqli($server, $user, $password, $dbname);
    if ($conn->connect_error) {
        header('location:la_error_db_connect.php');
        exit;
    }
    $sql = "INSERT INTO la_admin (id,user, pwd,ctime,pid,email) VALUES ('{$data['id']}','{$data['user']}', '{$data['pwd']}','{$data['ctime']}','{$data['pid']}','{$data['email']}')";
    $q_id = $conn->query($sql);
    if ($q_id == 0)
        header('location:la_error_db.php');
    return true;

}

/**
 * @param $user
 * @param $data
 * @param $server
 * @param $user
 * @param $password
 * @param $dbname
 * 设定la初始化配置
 */
function set_ba_asset_unit($user,$data, $server, $user, $password, $dbname)
{

    $conn = new mysqli($server, $user, $password, $dbname);
    if ($conn->connect_error) {

        header('location:la_error_db_connect.php');
        exit;
    }

    $sql = "INSERT INTO la_base (base_currency,unit,h5_url,api_url,ca_currency) VALUES ('{$data['benchmark_type']}','{$data['digital_unit']}','{$data['h5_url']}','{$data['api_url']}','{$data['ca_currency']}')";
    $q_id = $conn->query($sql);
    if ($q_id == 0){

        header('location:la_error_db_connect.php');
        exit;
    }
    $api_url = $data["api_url"];
    $h5_url = $data["h5_url"];
    $benchmark_type = $data["benchmark_type"];
    $userLanguage = $data["userLanguage"];
    $ca_currency = $data["ca_currency"];

    $str_tmp = "{\r\n"; //得到php的起始符。$str_tmp将累加


    $str_tmp .= '"api_url" : "';
    $str_tmp .= $api_url . '",';

    $str_tmp .= '"benchmark_type" : "';
    $str_tmp .= $benchmark_type . '",';

    $str_tmp .= '"ca_currency" : "';
    $str_tmp .= $ca_currency . '",';

    $str_tmp .= '"userLanguage" : "';
    $str_tmp .= $userLanguage . '",';

    $str_tmp .= '"h5_url" : "';
    $str_tmp .= $h5_url . '"';

    $str_tmp .= '}';


    $dir_path = dirname(dirname(dirname(dirname(__FILE__)))) . "/h5/";


    $sf = $dir_path . "/assets/json/config_url.json"; //文件名
    $fp = @fopen($sf, "w+"); //写方式打开文件

    if(!$fp) {

        header("location:la_error_permission_conf.php?u=$user&au=$api_url&hu=$h5_url&bt=$benchmark_type&cc=$ca_currency&ul=$userLanguage");
        exit();

    }
    if(!@fwrite($fp, $str_tmp)){

        header("location:la_error_permission_conf.php?u=$user&au=$api_url&hu=$h5_url&bt=$benchmark_type&cc=$ca_currency&ul=$userLanguage");
        exit();

    }
    fclose($fp); //关闭文件

}

/**
 * @param $data
 * @return bool
 * 检查用户是否修改config_url.json
 */
function config_json_check($data){

    $dir_path = dirname(dirname(dirname(dirname(__FILE__)))) . "/h5/";

    $sf = $dir_path . "assets/json/config_url.json"; //文件名


    $content = file_get_contents($sf);
    //如果文件不存在，提示重新上传
    if(!$content)
        return false;

    $content = json_decode($content,1);

    //判断json文件内配置是否完整

    //如果文件内容与填写不一致，提示重新上传
    foreach($content as $k=>$v){
        if($k=='api_url'){
            if($data['au']!=$v)
                return false;
        }
        if($k=='h5_url'){
            if($data['hu']!=$v)
                return false;
        }
        if($k=='benchmark_type'){
            if($data['bt']!=$v)
                return false;
        }
        if($k=='ca_currency'){
            if($data['cc']!=$v)
                return false;
        }
        if($k=='userLanguage'){
            if($data['ul']!=$v)
                return false;
        }
    }

    return true;

}
/**
 * @return void()
 * 最后一次检查数据库连接，确认用户是否已经将配置文件写入la_db_connect.php
 */
function db_connect_check_final()
{

    $db = new DB_COM();
    $res = $db->connect_test();
    switch ($res) {

        case '1':
            header('location:la_error_db_select.php');
            exit;
            break;
        case '2':
            header('location:la_error_db_connect.php');
            exit;
            break;
        default:
            break;
    }
}

/**
 * @return array
 * 获得管理员信息
 */
function admin_get($server, $user, $password, $dbname)
{
    $conn = new mysqli($server, $user, $password, $dbname);
    if ($conn->connect_error) {
        header('location:la_error_db_connect.php');
        exit;
    }
    $sql = "select * from la_admin";
    $res = $conn->query($sql, true);
    return $res;
}


/**
 * @param $data
 * @param $server
 * @param $user
 * @param $password
 * @param $dbname
 * @return bool
 * 创建token信息
 */
function config_create($data, $server, $user, $password, $dbname)
{
    $conn = new mysqli($server, $user, $password, $dbname);

    if ($conn->connect_error) {
        header('location:la_error_db_connect.php');
        exit;
    }

    $sql = "INSERT INTO com_option_config (option_name, option_key,option_value,option_sort,sub_id,status) VALUES 
    ('{$data['option_name']}', '{$data['option_key']}','{$data['option_value']}','{$data['option_sort']}','{$data['sub_id']}','{$data['status']}')";
    $q_id = $conn->query($sql);

    if ($q_id == 0)
        header('location:la_error_db.php');
    return true;
}

function unit_expire_time($type, $server, $user, $password, $dbname)
{
    $conn = new mysqli($server, $user, $password, $dbname);

    if ($conn->connect_error) {
        header('location:la_error_db_connect.php');
        exit;
    }


    $data = array();

    if ($type == 'ba') {
        $data['option_name'] = 'ba_valid_rate_time';
        $data['sub_id'] = 'BA';
    } else {
        $data['option_name'] = 'ca_valid_rate_time';
        $data['sub_id'] = 'CA';
    }

    $data['option_sort'] = 0;
    $data['option_key'] = 'time';
    $data['option_value'] = 259200;
    $data['status'] = 1;


    $sql = "INSERT INTO com_option_config (option_name, option_key,option_value,option_sort,sub_id,status) VALUES 
    ('{$data['option_name']}', '{$data['option_key']}','{$data['option_value']}','{$data['option_sort']}','{$data['sub_id']}','{$data['status']}')";
    $q_id = $conn->query($sql);

    if ($q_id == 0)
        header('location:la_error_db.php');
    return true;
}


function install_check()
{//检查la安装状态

    $filename = "../inc/db_connect.php";
    //检查数据库连接文件是否存在
    if (file_exists($filename)) {
        //检查数据库连接文件是否有效
        if(is_exist_database()){

            require_once "../inc/common.php";
            require_once "../inc/db_connect.php";
            $db = new DB_COM();
            $sql = "select * from la_admin where pid = '1,2,3,4,5' limit 1 ";
            $res = $db->query($sql);
            $res = $db->fetchRow();
            if ($res) {//如果已经安装，则跳至首页验证
                return true;
            }
            return false;
        }
        return false;
    }
    return false;
}

/**
 * 检查数据库连接文件是否有效
 * @return bool;
 *
 */
function is_exist_database()
{

    $file = '../inc/db_connect.php';
    $content = file($file);
    $length = count($content);
    $server = '';
    $user = '';
    $password = '';
    $database = '';
    $schema = '';
    //读取db配置文件，并获取server，user，password，database
    for ($i = 0;$i<$length;$i++)
    {

        $dbMatched = preg_match("/server/",$content[$i],$matches);
        if($matches){
            $serverMatched = preg_match("/(?<=').*?(?=')|(?<=\").*?(?=\")/", $content[$i], $matches);
            if(isset($matches[0])&&!empty($matches[0]))
                $server = $matches[0];
            continue;
        }

        $dbMatched = preg_match("/user/",$content[$i],$matches);
        if($matches){
            $serverMatched = preg_match("/(?<=').*?(?=')|(?<=\").*?(?=\")/", $content[$i], $matches);
            if(isset($matches[0])&&!empty($matches[0]))
                $user = $matches[0];
            continue;
        }

        $dbMatched = preg_match("/password/",$content[$i],$matches);
        if($matches){
            $serverMatched = preg_match("/(?<=').*?(?=')|(?<=\").*?(?=\")/", $content[$i], $matches);
            if(isset($matches[0])&&!empty($matches[0]))
                $password = $matches[0];
            continue;
        }

        $dbMatched = preg_match("/database/",$content[$i],$matches);
        if($matches){
            $serverMatched = preg_match("/(?<=').*?(?=')|(?<=\").*?(?=\")/", $content[$i], $matches);
            if(isset($matches[0])&&!empty($matches[0]))
                $database = $matches[0];
            continue;
        }

        $dbMatched = preg_match("/schema/",$content[$i],$matches);
        if($matches){
            $serverMatched = preg_match("/(?<=').*?(?=')|(?<=\").*?(?=\")/", $content[$i], $matches);
            if(isset($matches[0])&&!empty($matches[0]))
                $schema = $matches[0];
            continue;
        }
    }

    if(!$database||!$server||!$password)
        return false;
//检查数据库连接情况
    $conn = new mysqli($server, $user, $password);
    if ($conn->connect_error) {
        return false;
    }

//检查库是否存在
    $result = $conn->query('show databases;');
    While ($row = mysqli_fetch_assoc($result)) {
        $databases[] = $row['Database'];
    }

    $db_flag = 1;
    foreach ($databases as $k => $v ) {
        if($v==$database)
            $db_flag = 0;
    }
    if($db_flag)
        return false;

    //检查表是否存在
    $conn = new mysqli($server, $user, $password,$database);

    $table_exist = $conn->query("SELECT * FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME in ('la_base','com_option_config','com_base_balance'
            ,'la_admin')");

    while($row = $table_exist->fetch_assoc()){  $rows[]=$row;}
    
    if(count($rows)<4)
        return false;
    return true;

}

/**
 * @param $host
 * @param $dbu
 * @param $pwd
 * @param $db
 * @return bool
 * 检查db文件
 */
function before_install_check($host, $dbu, $pwd,$db){

    $file = '../inc/db_connect.php';
    $content = file($file);

    $length = count($content);
    //读取db配置文件，并获取server，user，password，database
    for ($i = 0;$i<$length;$i++)
    {

        $dbMatched = preg_match("/server/",$content[$i],$matches);
        if($matches){
            $serverMatched = preg_match("/(?<=').*?(?=')|(?<=\").*?(?=\")/", $content[$i], $matches);
            if(isset($matches[0])&&!empty($matches[0]))
                $server = $matches[0];
            else
                $server = '';
            continue;
        }

        $dbMatched = preg_match("/user/",$content[$i],$matches);
        if($matches){
            $serverMatched = preg_match("/(?<=').*?(?=')|(?<=\").*?(?=\")/", $content[$i], $matches);
            if(isset($matches[0])&&!empty($matches[0]))
                $user = $matches[0];
            else
                $user = '';
            continue;
        }

        $dbMatched = preg_match("/password/",$content[$i],$matches);
        if($matches){
            $serverMatched = preg_match("/(?<=').*?(?=')|(?<=\").*?(?=\")/", $content[$i], $matches);
            if(isset($matches[0])&&!empty($matches[0]))
                $password = $matches[0];
            else
                $password = '';
            continue;
        }

        $dbMatched = preg_match("/database/",$content[$i],$matches);
        if($matches){
            $serverMatched = preg_match("/(?<=').*?(?=')|(?<=\").*?(?=\")/", $content[$i], $matches);
            if(isset($matches[0])&&!empty($matches[0]))
                $database = $matches[0];
            else
                $database = '';
            continue;
        }

        $dbMatched = preg_match("/schema/",$content[$i],$matches);
        if($matches){
            $serverMatched = preg_match("/(?<=').*?(?=')|(?<=\").*?(?=\")/", $content[$i], $matches);
            if(isset($matches[0])&&!empty($matches[0]))
                $schema = $matches[0];
            else
                $schema = '';
            continue;
        }
    }
    if($db!=$database||$host!=$server||$dbu!=$user||$password!=$pwd)
        return false;

    $conn = new mysqli($server, $user, $password, $database);

    if ($conn->connect_error)
        return false;
    return true;
}

/**
 * la安装步骤验证
 */
//@TODO last_login_ip => reinstall_flag la_admin新增一个字段，重启LA标示
function install_check_steps()
{
    $reinstall = install_check();
    if ($reinstall) {//如果已经安装，需超级管理员邮箱验证

        //检查重启LA标示
        $db = new DB_COM();
        $sql = "select last_login_ip from la_admin where pid ='1,2,3,4,5' limit 1";
        $db->query($sql);
        $reinstall_res = $db->fetchRow();
        $reinstall_flag = $reinstall_res['last_login_ip'];
        if (!$reinstall_flag) {//如果重启标示未设置，重新进入邮箱验证步骤

            header('location:la_restart_confirm.php');
            exit();

        }

        if (isset($_REQUEST['reinstall_flag'])) {//验证签名

            if ($reinstall_flag != $_REQUEST['reinstall_flag']) {//如果签名验证失败，重新进入邮箱验证步骤
                header('location:la_restart_confirm.php');
                exit();
            }
        } else {//如果未传签名，重新进入邮箱验证步骤

            header('location:la_restart_confirm.php');
            exit();
        }

    }
}


