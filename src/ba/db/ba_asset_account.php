<?php

//======================================
// 函数: 查询地址是否存在
// 参数: ba_id               用户id
//      dataArr             地址的数组
// 返回: true                地址存在
// 返回: false               地址不存在
//======================================
function sel_ba_bit_account_info($ba_id, $dataArr)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_asset_account WHERE ba_id = '{$ba_id}' and bit_address in ('".implode("','",$dataArr)."')";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}

//======================================
// 函数: 查询地址是否存在
// 参数: ba_id               用户id
//      dataArr             地址
// 返回: true                地址存在
// 返回: false               地址不存在
//======================================
function sel_single_ba_bit_account_info($ba_id, $bit_address)
{
    $db = new DB_COM();
    $sql = "SELECT count(*) FROM ba_asset_account WHERE ba_id = '{$ba_id}' and bit_address = '{$bit_address}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    if ($rows["count(*)"])
        return false;
    return true;
}
//======================================
// 函数: 插入地址
// 参数: data_base              用户信息数组
//         ba_id                用户id
//         bit_type             代理商类型
//         bind_flag            绑定标志
//         ctime                创建时间
//       dataArr                地址的数组
// 返回: true                    插入成功
// 返回: false                   插入失败
//======================================
function ins_ba_bit_account_info($data_base, $dataArr)
{
    $db = new DB_COM();
    $value_str = '';
    foreach ($dataArr as $key => $val) {
        $lgn_type = 'phone';
        $utime = time() . rand(1000, 9999);
        $ctime = date('Y-m-d H:i:s');
        $us_ip = get_ip();
        $data_base['account_id'] = hash('md5', $data_base["ba_id"] . $lgn_type . $us_ip . $utime . $ctime);
        $value_str [] = "'" . $val . "','" . $data_base['account_id'] . "','" . $data_base['ba_id'] . "','" . $data_base['bit_type'] . "','" . $data_base['bind_flag'] . "','" . $data_base['batch_id'] . "','" . $data_base['ctime'] . "'";
    }
    $sql = "insert into ba_asset_account (bit_address,account_id,ba_id,bit_type,bind_flag,batch_id,ctime) values ("
        . implode("),(", $value_str) . ")";
    if (!$db->query($sql))
        return false;
    return true;

}
//======================================
// 函数: 插入地址
// 参数: data_base             用户信息数组
//         ba_id               用户id
//         bit_type            代理商类型
//         bind_flag           绑定标志
//         ctime               创建时间
//      dataArr                地址的数组
// 返回: true                    插入成功
// 返回: false                   插入失败
//======================================
function ins_ba_bit_account_info_with_csv($data_base)
{
    $db = new DB_COM();
    $sql = $db->sqlInsert("ba_asset_account", $data_base);
    if (!$db->query($sql))
        return false;
    return true;
}
//======================================
// 函数: 用户充值分配ba地址
// 参数: ba_id             ba用户id
//      us_id             用户id
// 返回: rows              用户地址信息数组
//        account_id      账号ID
//        bit_address     数字货币地址
//======================================
function get_ba_bit_account_ba_id($ba_id, $us_id)
{
    $db = new DB_COM();
    //充值信息存在，返回原先的地址
    $sql = "SELECT bind_flag,account_id,bit_address FROM ba_asset_account WHERE ba_id = '{$ba_id}' and bind_us_id = '{$us_id}' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    if ($rows["bind_flag"] == 1) {
        return $rows;
    }
    //分配新的地址
    $sql = "SELECT * FROM ba_asset_account WHERE ba_id = '{$ba_id}' and bind_flag = '0' limit 1";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}
//======================================
// 函数: 绑定地址以后，更新ba_asset_account信息
// 参数: ba_id             ba用户ba_id
//      us_id             us用户id
//      account_id        账号ID
//      utime             更新时间
// 返回: true              更新成功
// 返回: false             更新失败
//======================================
function upd_ba_base_account_info($ba_id, $us_id, $account_id, $utime)
{
    $db = new DB_COM();
    $sql = "UPDATE ba_asset_account SET bind_flag = '1', bind_us_id = '{$us_id}', utime = '{$utime}' WHERE ba_id = '{$ba_id}' and account_id = '{$account_id}'";
    $db->query($sql);
    $count = $db->affectedRows($sql);
    return $count;
}
//======================================
// 函数: ba查询地址列表
// 参数: ba_id              用户id
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
function get_ba_asset_bit_account($ba_id, $page_size, $page_num)
{
    $db = new DB_COM();
    $sql = "SELECT * FROM ba_asset_account WHERE ba_id = '{$ba_id}' order by bind_flag asc  limit " . (($page_num) * $page_size) . "," . (($page_num + 1) * $page_size);
    $db->query($sql);
    $rows = $db->fetchAll();
    return $rows;
}
//======================================
// 函数：根据ba分配用户地址时的account_id，来查询该用户的充值地址
// 参数: account_id                账号ID
// 返回: bit_address               地址
//======================================
function get_ba_asset_account_ba_id($account_id)
{
    $db = new DB_COM();
    $sql = "SELECT bit_address FROM ba_asset_account WHERE account_id = '{$account_id}'";
    $db->query($sql);
    $bit_address = $db->getField($sql, 'bit_address');
    return $bit_address;
}
