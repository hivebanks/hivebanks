<?php

//======================================
//  获取用户身份认证的信息列表
// 参数:
// 返回: rows            列表数组
//    log_id        绑定日志id
//    us_id          用户id
//    bind_type      绑定类型
//    bind_name      绑定名称
//    bind_info      绑定内容
//    bind_salt      绑定的盐
//    count_error    错误次数
//    limt_time      限定时间戳
//    ctime          创建时间
//======================================
function kyc_user_bind_idcard_list(){
    $db = new DB_COM();
    $sql = "select * from us_log_bind where ((bind_type = 'text' and bind_name = 'name') or (bind_type='file' and bind_name='idPhoto')  
            or (bind_type='text' and bind_name='idNum')) and count_error = 0
        order by ctime desc ,us_id desc ";
//    echo $sql;
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}

//======================================
// 函数: 用户姓名审核通过
// 参数: us_id          用户id
//       name           用户姓名
//       bind_id        绑定id
//       log_id         日志id
// 返回: false          失败
//       true           成功
//======================================
function name_pass($us_id,$name,$bind_id,$log_id)
{
    $data['bind_id'] = $bind_id;
    $data['us_id'] = $us_id;
    $data['bind_type'] = 'text';
    $data['bind_name'] = 'name';
    $data['bind_info'] = $name;
    $data['bind_flag'] = 1;
    $data['utime'] = time();
    $data['ctime'] = date("Y-m-d H:i:s");
    $db = new DB_COM();
    $sql = $db->sqlInsert('us_bind', $data);
    $q_id = $db->query($sql);
    $sql_update = "update us_log_bind set count_error = 2 where log_id= '{$log_id}' ";
    $db->query($sql_update);
    if ($q_id == 0 || !$db->affectedRows())
        return false;
    return true;
}
//======================================
// 函数: 用户身份证号审核通过
// 参数: us_id          用户id
//       idNum          身份证号
//       bind_id        绑定id
//       log_id         日志id
// 返回: false          失败
//       true           成功
//======================================
function idNum_pass($us_id,$idNum,$bind_id,$log_id){
    $data['bind_id'] = $bind_id;
    $data['us_id'] = $us_id;
    $data['bind_type'] = 'text';
    $data['bind_name'] = 'idNum';
    $data['bind_info'] = $idNum;
    $data['bind_flag'] = 1;
    $data['utime'] = time();
    $data['ctime'] = date("Y-m-d H:i:s");
    $db = new DB_COM();
    $sql = $db->sqlInsert('us_bind', $data);
    $q_id = $db->query($sql);

    $sql_update = "update us_log_bind set count_error = 2 where log_id='{$log_id}'";
    $db->query($sql_update);

    if ($q_id == 0 || !$db->affectedRows())
        return false;
    return true;

}
//======================================
// 函数: 用户身份证图片审核通过
// 参数: us_id          用户id
//       idPhoto        用户身份证图片
//       bind_id        绑定id
//       log_id         日志id
// 返回: false          失败
//       true           成功
//======================================
function idPhoto_pass($us_id,$idPhoto,$bind_id,$log_id){
    $data['bind_id'] = $bind_id;
    $data['us_id'] = $us_id;
    $data['bind_type'] = 'file';
    $data['bind_name'] = 'idPhoto';
    $data['bind_info'] = $idPhoto;
    $data['bind_flag'] = 1;
    $data['utime'] = time();
    $data['ctime'] = date("Y-m-d H:i:s");
    $db = new DB_COM();
    $sql = $db->sqlInsert('us_bind', $data);
    $q_id = $db->query($sql);


    $sql_update = "update us_log_bind set count_error = 2 where log_id='{$log_id}'";
    $db->query($sql_update);
    if ($q_id == 0 || !$db->affectedRows())
        return false;
    return true;

}
//======================================
// 函数: 用户审核拒绝
// 参数: log_id         日志id
// 返回: false          失败
//       true           成功
//======================================
function user_refuse($log_id)
{
    $db = new DB_COM();
    $sql = "update us_log_bind set count_error = 1 where log_id='{$log_id}'";
    $db->query($sql);
    return $db->affectedRows();

}
//======================================
// 函数: 故障申告列表
// 参数: limit      页数
//       offset     偏移量
// 返回: row         信息数组
//======================================
function feedback_list($is_deal)
{

    $db = new DB_COM();
    if($is_deal==1) {
        $sql = "select * from com_feedback where log_status = 9 order by submit_time desc";
    }else{
        $sql = "select * from com_feedback where log_status in(0,1,2)  order by submit_time desc";
    }
    $db->query($sql);
    return $db->fetchAll();

}
//======================================
// 函数: 故障申告分析信息
// 参数: data        信息数组
// 返回: false          失败
//      true           成功
//======================================
function feedback_analyse($data)
{
    $analyse_name = $data['analyse_name'];
    $analyse_time = date('Y-m-d H:i:s',time());
    $analyse_id   = $data['analyse_id'];
    $analyse_info   = $data['analyse_info'];
    $log_id = $data['log_id'];

    $db = new DB_COM();
    $sql = "update com_feedback set analyse_name='{$analyse_name}',analyse_time = '{$analyse_time}',analyse_id='{$analyse_id}',
                analyse_info='{$analyse_info}',log_status=2 where log_id = '{$log_id}'";
    $db->query($sql);
    if($db->affectedRows())
        return true;
    return false;

}
//======================================
// 函数: 故障申告解决信息
// 参数: data        信息数组
// 返回: false          失败
//      true           成功
//======================================
function feedback_done($data)
{
    $deal_time = date('Y-m-d H:i:s',time());
    $deal_id   = $data['deal_id'];
    $deal_name = $data['deal_name'];
    $deal_info = $data['deal_info'];
    $log_id = $data['log_id'];
    $db = new DB_COM();
    $sql = "update com_feedback set deal_time='{$deal_time}',deal_id='{$deal_id}',deal_name='{$deal_name}',
              deal_info='{$deal_info}',log_status = 9 where log_id='{$log_id}'";
    $db->query($sql);
    if($db->affectedRows())
        return true;
    return false;

}
//======================================
// 函数: 故障申告接受信息
// 参数: data        信息数组
// 返回: false          失败
//      true           成功
//======================================
function feedback_accept($log_id)
{
    $db = new DB_COM();
    $sql = "update com_feedback set log_status=1 where log_id='{$log_id}'";
    $db->query($sql);
    if($db->affectedRows())
        return true;
    return false;
}
