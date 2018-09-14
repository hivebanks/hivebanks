<?php

//======================================
// 故障申告提交
// 参数: data        信息数组
// 返回: true        成功
//      false        失败
//======================================
function feedback_submit($data)
{
    $db = new DB_COM();
    $submit_id = $data['submit_id'];
    $sql_exist = "select * from com_feedback where submit_id='{$submit_id}' and log_status=0";
    $db->query($sql_exist);
    if($db->recordCount()>=7)
        exit_error('558','提交次数过多，请稍后再试');
    $sql = $db->sqlInsert("com_feedback", $data);
    $db->query($sql);
    if($db -> affectedRows())
        return true;
    return false;
}
//======================================
// 故障申告列表
// 参数: ubmit_id         提交者id
// 返回: rows              故障申告信息数组
//======================================
function feedback_list($submit_id)
{
    $db = new DB_COM();
    $sql = "select * from com_feedback where submit_id='{$submit_id}'";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
