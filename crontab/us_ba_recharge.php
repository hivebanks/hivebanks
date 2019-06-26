<?php
/**
 * Created by PhpStorm.
 * User: fanzhuguo
 * Date: 2019/5/20
 * Time: 下午6:15
 */

ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

header("cache-control:no-cache,must-revalidate");
header("Content-Type:application/json;charset=utf-8");

require_once '/alidata/www/ccvt/api/inc/common.php';
require_once '/alidata/www/ccvt/api/inc/common_agent_email_service.php';
define('FLAG', '22');
define('ETHEREUM_UNIT', 1000000000000000000);
define('BA_ADDRESS', '0x1776f60d7948354ab59a00f8e73a6feccbbe481d');//BA充值地址，如果出现多个ba，则改为数组，最外层foreach，一次筛选
define('FUBT_ADDRESS', '0x1800246b58dc9edf07013b66a5a6800a9596f419');//fubt地址，不允许设置为绑定地址
define('UNIT', 100000000);
define('EMAIL', "fanzhuguo123@qq.com");
define('CTIME', date('Y-m-d H:i:s', time()));
define('UTIME', time());


$url = 'http://api.etherscan.io/api?module=account&action=tokentx&address='.BA_ADDRESS.'&startblock=0&endblock=999999999&sort=desc';

$the_last_request_db = get_last_recharge_db(BA_ADDRESS);

$transaction_list_ethereum = json_decode(file_get_contents($url),1);

if($transaction_list_ethereum['result']) {
    //数据表里取最近一条、与以太坊的最近一条开始对比，比到交易hash相同时结束脚本；
    $result = $transaction_list_ethereum['result'];
    foreach ($result as $k => $v) {
        if($v['to']!== '0x1776f60d7948354ab59a00f8e73a6feccbbe481d')//如果是转出
            continue;
        if ($v['hash'] === $the_last_request_db)
            break;
        deal_recharge($v);
    }
}else{

    var_dump($transaction_list_ethereum);die;
}

function get_last_recharge_db($official_address){
    $db = new DB_COM();
    $sql  = "select tx_detail from us_ba_recharge_request where recharge_address = '{$official_address}' and 
              qa_flag in (1,2) order by ethereum_time desc limit 1";
    $db->query($sql);
    $hash = $db->getField($sql , 'tx_detail');
    $hash = json_decode($hash,1);
    if(isset($hash['hash'])&&$hash['hash'])
        return  $hash['hash'];
    return false;
}

function deal_recharge($datas){

    if($datas['tokenSymbol'] !== 'CCVT')
        return false;

    $ba_id = get_ba_id_re();
    $us_id = get_us_id($datas['from']);
    $charge_amount = $datas['value'] / ETHEREUM_UNIT;
    $flag_no_bind_address = 'yes';

    if(!$us_id || $datas['from'] == FUBT_ADDRESS){
        $us_id = '8D5664EC-2722-B70B-7DF7-80EFE8118CFD';
        $flag_no_bind_address = 'no';
    }

    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务


    //ba减钱

    $sql = "update ba_base set base_amount = base_amount - ($charge_amount * 100000000) where ba_id = '{$ba_id}'";
    $db->query($sql);
    if(!$db->affectedRows()) {
        $db->Rollback($pInTrans);
        return false;
    }

    //us加钱
    $sql = "update us_base set base_amount = base_amount + ($charge_amount * 100000000) where us_id = '{$us_id}'";
    $db->query($sql);
    if(!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return false;
    }


    $in = $us_id;
    $out = $ba_id;$us_type = 'ba_in';
    //comBase表
    //接受者
    $data['tx_count'] = base_get_pre_count($in);
    $data['hash_id']  = hash('sha256', $in  . get_ip() . mt() . rand(1000, 9999) . CTIME);
    $data['tx_id']    = hash('sha256', $in . 'phone' . get_ip() . mt() . date('Y-m-d H:i:s'));
    $data['prvs_hash'] = get_recharge_pre_hash($in);

    $data['prvs_hash']      = $data['prvs_hash'] === 0 ? $data['hash_id'] : $data['prvs_hash'];
    $data['debit_id']       = $out;
    $data['credit_id']      = $in;
    $data['tx_type']        = $us_type;
    $data["tx_amount"]      = $charge_amount * UNIT;
    $data["credit_balance"] = get_us_account($in) + ($charge_amount * UNIT);
    $data["utime"]          = UTIME;
    $data["ctime"]          = CTIME;
    $sql                    = $db->sqlInsert("com_base_balance", $data);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return 0;
    }
    //转出者
    $uata              = [];
    $uata['tx_count']  = base_get_pre_count($out);
    $uata['hash_id']   = hash('sha256', $out . $us_type . get_ip() . mt() . rand(1000, 9999) . CTIME);
    $uata['tx_id']     = hash('sha256', $in . 'phone' . get_ip() . mt() . date('Y-m-d H:i:s'));
    $uata['prvs_hash'] = get_recharge_pre_hash($out);
    $uata['prvs_hash'] = $uata['prvs_hash'] == 0 ? $uata['hash_id'] : $uata['prvs_hash'];

    $uata['debit_id']       = $in;
    $uata['credit_id']      = $out;
    $uata['tx_type']        = $us_type;
    $uata["tx_amount"]      = -$charge_amount * UNIT;
    $uata["credit_balance"] = get_ba_account($out) - ($charge_amount * UNIT);

    $uata["utime"] = UTIME;
    $uata["ctime"] = CTIME;
    $uql           = $db->sqlInsert("com_base_balance", $uata);
    if (!$db->query($uql)) {
        $db->Rollback($pInTrans);
        return 0;
    }
    //记录transfer表

    //赠送者
    $flag                    = FLAG;
    $boss['hash_id']         = hash('sha256', $out . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash               = get_pre_hash($out);
    $boss['prvs_hash']       = $prvs_hash === 0 ? $boss['hash_id'] : $prvs_hash;
    $boss['credit_id']       = $out;
    $boss['debit_id']        = $in;
    $boss['tx_amount']       = -($charge_amount * UNIT);
    $boss['credit_balance']  = get_ba_account($boss['credit_id']) - ($charge_amount * UNIT);
    $boss['tx_hash']         = hash('sha256', $out . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $boss['flag']            = $flag;
    $boss['transfer_type']   = 'ba-us';
    $boss['transfer_state']  = 1;
    $boss['tx_detail']       = "BA充值";
    $boss['give_or_receive'] = 1;
    $boss['ctime']           = time();
    $boss['utime']           = date('Y-m-d H:i:s');
    $boss['tx_count']        = transfer_get_pre_count($out);
    $sql                     = $db->sqlInsert("com_transfer_request", $boss);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return 0;
    }
    //接收者
    $receive['hash_id']         = hash('sha256', $in . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash                  = get_pre_hash($in);
    $receive['prvs_hash']       = $prvs_hash === 0 ? $receive['hash_id'] : $prvs_hash;
    $receive['credit_id']       = $in;
    $receive['debit_id']        = $out;
    $receive['tx_amount']       = $charge_amount * UNIT;
    $receive['credit_balance']  = get_us_account($in) + $charge_amount* UNIT;
    $receive['tx_hash']         = hash('sha256', $in . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $receive['flag']            = $flag;
    $receive['transfer_type']   = 'ba-us';
    $receive['transfer_state']  = 1;
    $receive['tx_detail']       = "BA充值";
    $receive['give_or_receive'] = 2;
    $receive['ctime']           = time();
    $receive['utime']           = date('Y-m-d H:i:s');
    $receive['tx_count']        = transfer_get_pre_count($in);
    $sql                        = $db->sqlInsert("com_transfer_request", $receive);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return 0;
    }



    //记录us_ba_rechage_request表
    $data_request['qa_flag'] = 1;
    $data_request['us_id'] = $us_id;
    $data_request['ba_id'] = $ba_id;
    $data_request['asset_id'] = $datas['tokenSymbol'];
    $data_request['ba_account_id'] = get_ba_account_id();
    $data_request['bit_amount'] = $charge_amount;
    $data_request['recharge_address'] = $datas['to'];
    $data_request['base_amount'] = $charge_amount * UNIT;
    $data_request['tx_hash'] = hash('md5', $ba_id . 'phone' . '127.0.0.1' . time() . mt());
    $data_request['tx_type'] = 1;
    $data_request['tx_detail'] = json_encode($datas);
    $data_request['tx_fee'] = 0;
    $data_request['ethereum_time'] = $datas['timeStamp'];
    $data_request['tx_time'] = mt();

    $sql = $db->sqlInsert('us_ba_recharge_request',$data_request);

    if(!$db->query($sql)){
        $db->Rollback($pInTrans);
        return false;
    }

    $db->Commit($pInTrans);

    //发送成功邮件
    $title = 'BA充值成功';
    $us_account = get_us_account_name($us_id);
    $body ="(官方地址充值)--地址是否正确:(".$flag_no_bind_address."----".$datas['from'].");用户(".$us_account.")于".date("Y-m-d H:i:s",$datas['timeStamp'])."发起充值".$charge_amount ."CCVT成功！
                已于".date("Y-m-d H:i:s",time())."到账。<br>
                交易hash为：".$datas['hash'];
    require_once "/alidata/www/ccvt/api/la/db/la_admin.php";
    $key_code = get_la_admin_info()["key_code"];

    send_email_by_agent_service(EMAIL,$title,$body,$key_code);
}




//========================充值个人地址===========================================
//========================充值个人地址===========================================
//========================充值个人地址===========================================
//========================充值个人地址===========================================
//========================充值个人地址===========================================
//========================充值个人地址===========================================
//========================充值个人地址===========================================

function get_recharge_list()
{
    $db = new DB_COM();
    $sql = "select bit_address,us_id from us_asset_bit_account  where bind_flag = 3";
    $db->query($sql);
    return $db->fetchAll();

}

$bit_address_list = get_recharge_list();

foreach ($bit_address_list as $kb => $v_info)
{
    $v_info['bit_address'] = strtolower($v_info['bit_address']);

    $url = 'http://api.etherscan.io/api?module=account&action=tokentx&address='.$v_info['bit_address'].'&startblock=0&endblock=999999999&sort=desc';

    $the_last_request_db = single_get_last_recharge_db($v_info['bit_address']);

    $transaction_list_ethereum = json_decode(file_get_contents($url),1);

    if($transaction_list_ethereum['result']) {
        //数据表里取最近一条、与以太坊的最近一条开始对比，比到交易hash相同时结束脚本；
        $result = $transaction_list_ethereum['result'];
        foreach ($result as $k => $v) {
            if($v['to']!= $v_info['bit_address'])//如果是转出
                continue;
            if ($v['hash'] === $the_last_request_db)
                break;
            singe_deal_recharge($v,$v_info['us_id']);
        }
    }else{

        var_dump($transaction_list_ethereum);die;
    }


}


function singe_deal_recharge($datas,$us_id){

    if($datas['tokenSymbol'] !== 'CCVT')
        return false;

    $ba_id = get_ba_id_re();

    $charge_amount = $datas['value'] / ETHEREUM_UNIT;

    $db = new DB_COM();
    $pInTrans = $db->StartTrans();  //开启事务


    //ba减钱

    $sql = "update ba_base set base_amount = base_amount - ($charge_amount * 100000000) where ba_id = '{$ba_id}'";
    $db->query($sql);
    if(!$db->affectedRows()) {
        $db->Rollback($pInTrans);
        return false;
    }

    //us加钱
    $sql = "update us_base set base_amount = base_amount + ($charge_amount * 100000000) where us_id = '{$us_id}'";
    $db->query($sql);
    if(!$db->affectedRows()){
        $db->Rollback($pInTrans);
        return false;
    }


    $in = $us_id;
    $out = $ba_id;$us_type = 'ba_in';
    //comBase表
    //接受者
    $data['tx_count'] = base_get_pre_count($in);
    $data['hash_id']  = hash('sha256', $in  . get_ip() . mt() . rand(1000, 9999) . CTIME);
    $data['tx_id']    = hash('sha256', $in . 'phone' . get_ip() . mt() . date('Y-m-d H:i:s'));
    $data['prvs_hash'] = get_recharge_pre_hash($in);

    $data['prvs_hash']      = $data['prvs_hash'] === 0 ? $data['hash_id'] : $data['prvs_hash'];
    $data['debit_id']       = $out;
    $data['credit_id']      = $in;
    $data['tx_type']        = $us_type;
    $data["tx_amount"]      = $charge_amount * UNIT;
    $data["credit_balance"] = get_us_account($in) + ($charge_amount * UNIT);
    $data["utime"]          = UTIME;
    $data["ctime"]          = CTIME;
    $sql                    = $db->sqlInsert("com_base_balance", $data);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return 0;
    }
    //转出者
    $uata              = [];
    $uata['tx_count']  = base_get_pre_count($out);
    $uata['hash_id']   = hash('sha256', $out . $us_type . get_ip() . mt() . rand(1000, 9999) . CTIME);
    $uata['tx_id']     = hash('sha256', $in . 'phone' . get_ip() . mt() . date('Y-m-d H:i:s'));
    $uata['prvs_hash'] = get_recharge_pre_hash($out);
    $uata['prvs_hash'] = $uata['prvs_hash'] == 0 ? $uata['hash_id'] : $uata['prvs_hash'];

    $uata['debit_id']       = $in;
    $uata['credit_id']      = $out;
    $uata['tx_type']        = $us_type;
    $uata["tx_amount"]      = -$charge_amount * UNIT;
    $uata["credit_balance"] = get_ba_account($out) - ($charge_amount * UNIT);

    $uata["utime"] = UTIME;
    $uata["ctime"] = CTIME;
    $uql           = $db->sqlInsert("com_base_balance", $uata);
    if (!$db->query($uql)) {
        $db->Rollback($pInTrans);
        return 0;
    }
    //记录transfer表

    //赠送者
    $flag                    = FLAG;
    $boss['hash_id']         = hash('sha256', $out . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash               = get_pre_hash($out);
    $boss['prvs_hash']       = $prvs_hash === 0 ? $boss['hash_id'] : $prvs_hash;
    $boss['credit_id']       = $out;
    $boss['debit_id']        = $in;
    $boss['tx_amount']       = -($charge_amount * UNIT);
    $boss['credit_balance']  = get_ba_account($boss['credit_id']) - ($charge_amount * UNIT);
    $boss['tx_hash']         = hash('sha256', $out . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $boss['flag']            = $flag;
    $boss['transfer_type']   = 'ba-us';
    $boss['transfer_state']  = 1;
    $boss['tx_detail']       = "BA充值";
    $boss['give_or_receive'] = 1;
    $boss['ctime']           = time();
    $boss['utime']           = date('Y-m-d H:i:s');
    $boss['tx_count']        = transfer_get_pre_count($out);
    $sql                     = $db->sqlInsert("com_transfer_request", $boss);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return 0;
    }
    //接收者
    $receive['hash_id']         = hash('sha256', $in . $flag . get_ip() . time() . rand(1000, 9999) . date('Y-m-d H:i:s'));
    $prvs_hash                  = get_pre_hash($in);
    $receive['prvs_hash']       = $prvs_hash === 0 ? $receive['hash_id'] : $prvs_hash;
    $receive['credit_id']       = $in;
    $receive['debit_id']        = $out;
    $receive['tx_amount']       = $charge_amount * UNIT;
    $receive['credit_balance']  = get_us_account($in) + $charge_amount* UNIT;
    $receive['tx_hash']         = hash('sha256', $in . $flag . get_ip() . time() . date('Y-m-d H:i:s'));
    $receive['flag']            = $flag;
    $receive['transfer_type']   = 'ba-us';
    $receive['transfer_state']  = 1;
    $receive['tx_detail']       = "BA充值";
    $receive['give_or_receive'] = 2;
    $receive['ctime']           = time();
    $receive['utime']           = date('Y-m-d H:i:s');
    $receive['tx_count']        = transfer_get_pre_count($in);
    $sql                        = $db->sqlInsert("com_transfer_request", $receive);
    if (!$db->query($sql)) {
        $db->Rollback($pInTrans);
        return 0;
    }



    //记录us_ba_rechage_request表
    $data_request['qa_flag'] = 1;
    $data_request['us_id'] = $us_id;
    $data_request['ba_id'] = $ba_id;
    $data_request['asset_id'] = $datas['tokenSymbol'];
    $data_request['ba_account_id'] = get_ba_account_id();
    $data_request['bit_amount'] = $charge_amount;
    $data_request['recharge_address'] = $datas['to'];
    $data_request['base_amount'] = $charge_amount * UNIT;
    $data_request['tx_hash'] = hash('md5', $ba_id . 'phone' . '127.0.0.1' . time() . mt());
    $data_request['tx_type'] = 1;
    $data_request['tx_detail'] = json_encode($datas);
    $data_request['tx_fee'] = 0;
    $data_request['ethereum_time'] = $datas['timeStamp'];
    $data_request['tx_time'] = mt();

    $sql = $db->sqlInsert('us_ba_recharge_request',$data_request);

    if(!$db->query($sql)){
        $db->Rollback($pInTrans);
        return false;
    }

    $db->Commit($pInTrans);

    //发送成功邮件
    $title = 'BA充值成功';
    $us_account = get_us_account_name($us_id);
    $body ="(个人地址充值)用户(".$us_account.")于".date("Y-m-d H:i:s",$datas['timeStamp'])."发起充值".$charge_amount ."CCVT成功！
                已于".date("Y-m-d H:i:s",time())."到账。<br>
                交易hash为：".$datas['hash'];
    require_once "/alidata/www/ccvt/api/la/db/la_admin.php";
    $key_code = get_la_admin_info()["key_code"];

    send_email_by_agent_service(EMAIL,$title,$body,$key_code);
}


function single_get_last_recharge_db($bit_address){
    $db = new DB_COM();
    $sql  = "select tx_detail from us_ba_recharge_request where qa_flag in (1,2) and recharge_address = '{$bit_address}' order by ethereum_time desc limit 1";
    $db->query($sql);
    $hash = $db->getField($sql , 'tx_detail');
    $hash = json_decode($hash,1);
    if(isset($hash['hash'])&&$hash['hash'])
        return  $hash['hash'];
    return false;
}





//========================充值个人地址===========================================
//========================充值个人地址===========================================
//========================充值个人地址===========================================
//========================充值个人地址===========================================
//========================充值个人地址===========================================
//========================充值个人地址===========================================
//========================充值个人地址===========================================















function get_us_account_name($us_id)
{
    $db = new DB_COM();
    $sql  = "select us_account from us_base where us_id = '{$us_id}'";
    $db->query($sql);
    $res = $db->getField($sql , 'us_account');
    if(!$res ){
        return false;
    }
    return $res;
}

function get_us_id($bit_address_us){
    $db = new DB_COM();
    $sql  = "select us_id from us_asset_bit_account where bit_address = '{$bit_address_us}' and bind_flag = 1 limit 1";
    $db->query($sql);
    $res = $db->getField($sql , 'us_id');
    if(!$res ){

        return false;
    }
    return $res;
}

function get_ba_account_id()
{
    $db = new DB_COM();
    $sql = "select account_id from ba_asset_account where bit_address = '".BA_ADDRESS ."'  limit 1";
    $ba_id = $db->getField($sql,'account_id');
    if ($ba_id==null){
        return 0;
    }
    return $ba_id;
}

function get_ba_id_re(){
    $db = new DB_COM();
    $sql = "select ba_id from ba_asset_account where bit_address = '".BA_ADDRESS ."'  limit 1";
    $ba_id = $db->getField($sql,'ba_id');
    if ($ba_id==null){
        return 0;
    }
    return $ba_id;
}

//======================================
// 函数: 获取上传交易hash
//======================================
function get_pre_hash($credit_id){
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_transfer_request WHERE credit_id = '{$credit_id}' ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}

/**
 * @param $credit_id
 * @return int|mixed
 * 获取上一个交易的链高度 （com_transfer_request表）
 */
function transfer_get_pre_count($credit_id)
{
    $db = new DB_COM();
    $sql = "select tx_count from com_transfer_request where credit_id = '{$credit_id}' order by tx_count desc limit 1";
    $tx_count = $db->getField($sql, 'tx_count');
    if($tx_count == null)
        return 1;
    return $tx_count+1;
}
/**
 * @param $credit_id
 * @return int|mixed
 * 获取上一个交易的链高度 （com_base_balance表）
 */
function base_get_pre_count($credit_id)
{
    $db = new DB_COM();
    $sql = "select tx_count from com_base_balance where credit_id = '{$credit_id}' order by tx_count desc limit 1";
    $tx_count = $db->getField($sql, 'tx_count');
    if($tx_count == null)
        return 1;

    return $tx_count+1;
}

//======================================
// 函数: 获取充值的前置hash
// 参数: ba_id                 baID
// 返回: hash_id               前置hashid
//======================================
function  get_recharge_pre_hash($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$ba_id}' ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}



//获取ba余额
function get_ba_account($ba_id){
    $db = new DB_COM();
    $sql = "select base_amount from ba_base WHERE ba_id='{$ba_id}' limit 1";
    $db->query($sql);
    $base_amount = $db -> getField($sql,'base_amount');
    if($base_amount == null)
        return 0;
    return $base_amount;
}



//======================================
// 函数: 获取上传交易hash
//======================================
function get_transfer_pre_hash($credit_id){
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_transfer_request WHERE credit_id = '{$credit_id}' ORDER BY  tx_count DESC LIMIT 1";
    $hash_id = $db->getField($sql, 'hash_id');
    if($hash_id == null)
        return 0;
    return $hash_id;
}


//获取用户余额
function get_us_account($us_id){
    $db = new DB_COM();
    $sql = "select (base_amount+lock_amount) as base_amount from us_base WHERE us_id='{$us_id}' limit 1";
    $db->query($sql);
    $base_amount = $db -> getField($sql,'base_amount');
    if($base_amount == null)
        return 0;
    return $base_amount;
}


function mt(){

    $time = explode (" ", microtime () );
    $time = $time [1] . ($time [0] * 1000);
    $time2 = explode ( ".", $time );
    $time = $time2 [0];
    return $time;
}
