<?php

//======================================
// 函数: 查询地址是否存在
// 参数: ca_id              用户id
//      dataArr            地址的数组
// 返回: true                地址存在
// 返回: false               地址不存在
//======================================
function sel_ca_asset_account_info($ca_id, $card_nm)
{
    $db = new DB_COM();
    $sql = "SELECT lgl_address FROM ca_asset_account WHERE ca_id = '{$ca_id}'";
    $db->query($sql);
    $rows = $db->fetchAll();
    foreach ($rows as $row){
        if (json_decode($row['lgl_address'],true)["card_nm"] == $card_nm)
            return true;
    }
    return false;
}
//======================================
// 函数: 插入地址
// 参数: data_base             用户信息数组
//         ca_id               用户id
//         bit_type            代理商类型
//         bind_flag           绑定标志
//         ctime               创建时间
//       dataArr               地址的数组
// 返回: true                    插入成功
// 返回: false                   插入失败
//======================================
function ins_ca_asset_account_info($data_base)
{
    $db = new DB_COM();
    $sql = $db->sqlInsert("ca_asset_account", $data_base);
    $row = $db->query($sql);
    return $row;
}
//======================================
// 函数: 用户充值分配ba地址
// 参数: ca_id            ba用户id
//      us_id            用户id
// 返回: rows            用户地址信息数组
//        account_id      账号ID
//        bit_address     数字货币地址
//======================================
function get_ca_bit_account_ca_id($ca_id, $us_id)
{
    $db = new DB_COM();
    //充值信息存在，返回原先的地址
    $sql = "SELECT * FROM ca_asset_account WHERE ca_id = '{$ca_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
//    if ($rows["use_flag"] == 1) {
//        return $rows;
//    }
//
//    //分配新的地址
//    $sql = "SELECT * FROM ca_asset_account WHERE ca_id = '{$ca_id}' and use_flag = '0' limit 1";
//    $db->query($sql);
//    $rows = $db->fetchRow();
//    if (!$rows["account_id"]) {
//        //可以给ba发邮件
//        exit_error(1, "ba的地址不足");
//    }
    return $rows;
}
//======================================
// 函数: 绑定地址以后，更新ca_asset_account信息
// 参数: ca_id             ba用户ca_id
//      us_id             us用户id
//      account_id        账号ID
//      utime             更新时间
// 返回: true              更新成功
// 返回: false             更新失败
//======================================
function upd_ca_base_account_info($ca_id, $us_id, $account_id, $utime)
{
    $db = new DB_COM();
    $sql = "UPDATE ca_asset_account SET use_flag = '1',  utime = '{$utime}' WHERE ca_id = '{$ca_id}' and account_id = '{$account_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    if (!$count) {
        exit_error(1, "绑定失败");
    }
    return true;
}

//======================================
// 函数: ba查询地址列表
// 参数: ca_id              用户id
//      page_size          每页数量
//      page_num           偏移量
// 返回: rows               地址数组
//          bit_address     数字货币地址
//          account_id      账号ID
//          ctime           更新时间
//          bind_flag       绑定标志
//          bind_us_id      绑定用户ID
//          utime           创建时间
//======================================
function get_ca_asset_bit_account($ca_id, $page_size, $page_num)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ca_asset_account WHERE ca_id = '{$ca_id}' order by bind_flag asc  limit " . (($page_num) * $page_size) . "," . (($page_num + 1) * $page_size);
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}

//======================================
// 函数: 根绝id，查询地址
// 参数: account_id                账号ID
// 返回: bit_address               地址
//======================================
function get_ca_asset_account_ca_id($account_id)
{
    $db = new DB_COM();
    $sql = "SELECT lgl_address FROM ca_asset_account WHERE account_id = '{$account_id}'";
    $db->query($sql);
    $bit_address = $db->getField($sql, 'lgl_address');
    return $bit_address;
}
//======================================
// 函数: 获取ca渠道列表
// 参数:
// 返回: rows              渠道列表数组信息
//======================================
function  ca_get_distinct_ca_channel_list()
{
    $db = new DB_COM();
    //充值信息存在，返回原先的地址
    $sql = "SELECT distinct ca_channel FROM ca_asset_account";
    $db -> query($sql);
    $rows = $db -> fetchAll();
    return $rows;
}
//======================================
// 函数: 获取资产信息
// 参数: ca_id                  caID
// 返回: rows                   信息数组信息
//======================================
function ca_get_asset_account_info($ca_id)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ca_asset_account WHERE ca_id = '{$ca_id}'";
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
