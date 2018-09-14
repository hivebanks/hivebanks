<?php

//======================================
// 参数: data     信息数组
// 返回: true     成功
//       false   失败
//======================================
function us_asset_action($data){
    $db = new DB_COM();
    $sql = $db->sqlInsert('com_asset_balance',$data);
    $res = $db->query($sql);
    if($res)
        return true;
    else
        return false;
}
