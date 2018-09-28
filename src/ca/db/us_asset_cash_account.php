<?php

//======================================
//获取用户法币资产外部账号
// 参数: us_id       用户id
// 返回: time        时间
//       row         外部账号信息数组
//         account_id  账号id
//          us_id      用户id
//          cash_type   法币类型
//          cash_channel 法币渠道
//          lgl_address   法比地址
//           bind_flag     绑定标志
//           utime         更新时间
//           ctime         创建时间
//======================================
function get_us_asset_cash_account_info($us_id,$time) {
    $db = new DB_COM();
    $sql = "SELECT * FROM us_asset_cash_account where us_id = '{$us_id}' and ctime > '{$time}'";
    $db -> query($sql);
    $row = $db ->fetchRow();
    return $row;
}


function get_us_asset_cash_account_info_by_account_id($account_id) {
    $db = new DB_COM();
    $sql = "SELECT * FROM us_asset_cash_account where account_id = '{$account_id}' limit 1";
    $db -> query($sql);
    $row = $db ->fetchRow();
    return $row;
}
