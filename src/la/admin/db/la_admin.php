<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/8/2
 * Time: 下午7:15
 */

/**
 * @param $user
 * @param $password
 * @return bool
 * 检查登陆账号密码
 */
function login_check($user,$password){

    $db = new DB_COM();
    $sql = "select *  from la_admin where user = '{$user}' and pwd = '{$password}'";
    $db->query($sql);
    $res = $db->fetchRow();

    if($res)
        return true;
    return false;

}

/**
 * @param $user
 * @return int
 * 登陆失败计数：登陆错误超过三次则限制登陆30分钟
 */
function login_failed_log_count($user,$login_time){

    $time = $login_time-1800;

    $db = new DB_COM();
    $sql = "select log_id from la_login_log where login_status = 0 and user = '{$user}' and login_time>'{$time}' ";
    $db->query($sql);
    return $db->affectedRows();

}

/**
 * @param $data
 * @return bool
 * 记录登陆情况
 */
function login_log($data){

    $db = new DB_COM();

    $sql = $db->sqlInsert('la_login_log',$data);
    $res = $db->query($sql);
    if($res)
        return true;
    return false;
}

/**
 * @param $user
 * 登陆成功返回 用户信息和可见菜单
 */
function login_user_info($user){

    $db = new DB_COM();
    $sql = "select id,user,real_name,pid,last_login_time,last_login_city,last_login_ip from la_admin where user='{$user}'";
    $db->query($sql);
    $res = $db->fetchRow();

    $return_array = array();
    $pid_array = array();
    $pid_array = explode(',',$res['pid']);
    $pid_list  = array();
    foreach ($pid_array as $pid){

        $sql = "select pname,subname from la_permit where pid='{$pid}'";
        $db->query($sql);
        $pid_single = $db->fetchAll();
        $pid_list[] = $pid_single;

    }
    $return_array['menu'] = $pid_list;
    $return_array['user_info'] = $res;

    return $return_array;

}

/**
 * @param $user
 * @param $ip_login
 * @param $city_login
 * @param $time_login
 * @return int
 *
 * 更新用户登陆记录（最近一次登陆时间，城市，ip）
 */
function login_bingo_update($user,$ip_login,$city_login,$time_login){

    $db = new DB_COM();
    $sql = "update la_admin set last_login_time = '{$time_login}' , last_login_city='{$city_login}' , last_login_ip='{$ip_login}'
            where user = '{$user}'";
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;

}

/**
 * @param $pid
 * @param $real_name
 * @param $pass_word_hash
 * @return true or false
 *
 * 添加新的管理员
 */
function admin_add($data_set){
    $data_set['ctime'] = time();
    $db = new DB_COM();
    $sql = $db->sqlInsert('la_admin',$data_set);
    $res = $db->query($sql);
    if($res)
        return true;
    return false;
}


/**
 * @param $user
 * @return true or false
 *
 * 删除管理员
 */
function delect_admin($user){

    $db = new DB_COM();
    $sql = "DELETE from la_admin where user='{$user}'";
    $res = $db->query($sql);
    if($res)
        return true;
    return false;
}


//======================================
//  查询la
// 参数: user         la的ID
// 返回:
//       count        影响的行数
//======================================
function get_la_by_user($id){
    $db = new DB_COM();
    $sql = "select * from la_admin where id='{$id}' ";
    $db->query($sql);
    return $count = $db->affectedRows();
}

//======================================
//  修改管理员信息
// 参数: data         管理员信息数组
// 返回:
//       count      影响行数
//======================================
function modify_admin($data){
    $db = new DB_COM();
    $sql = "update la_admin set user = '{$data['user']}' , real_name = '{$data['real_name']}',pid = '{$data['pid']}'";
    $db->query($sql);
    $count = $db -> affectedRows();
    return $count;
}


/**
 * 检查用户邮箱是否匹配
 * @param $email
 * @param $user
 * @return array
 */
function user_email_check($email, $user)
{
    $db = new DB_COM();
    $sql = "select * from la_admin where email = '{$email}' and user = '{$user}'";
    $db->query($sql);
    return $db->fetchRow();
}

/**
 * 更新密码
 * @param $user
 * @param $password
 * @param $email
 */
function update_password($user,$password,$email)
{
    $db = new DB_COM();
    $sql = "update la_admin set pwd = '{$password}' where user = '{$user}' and email= '{$email}'";
    $db->query($sql);
    return $db->affectedRows();
//    if(!$db->affectedRows())
//        exit_error('533','更新失败');
}


/**
 * 发送密码邮件
 * @param $password
 * @param $email
 * @param string $title
 * @return bool
 */
function email_password($password,$email,$title = 'LA密码重置')
{
    require_once "../../../../inc/common_agent_email_service.php";

    $body = '您的新密码为：'.$password.'。请妥善保管！';
    require_once "../db/la_admin.php";
    $key_code = get_la_admin_info()["key_code"];

    $output_array = send_email_by_agent_service($email,$title,$body,$key_code);
    return $output_array;
}

function get_la_admin_info()
{
    $db = new DB_COM();
    $sql = "SELECT * FROM la_admin  limit 1";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}


function upd_la_admin_key_code($la_id,$key_code) {
    $db = new DB_COM();
    $sql = "UPDATE la_admin SET key_code = '{$key_code}' WHERE id = '{$la_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}
