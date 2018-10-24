<?php

//======================================
// 获取用户资金总和
// 参数:
// 返回:rows                       信息数组
//      sum(base_amount)           基准资金总和
//      sum(lock_amount)            锁定资金总和
//======================================
function get_us_sum_amout_info()
{
    $db = new DB_COM();
    $sql = "SELECT sum(base_amount),sum(lock_amount) FROM us_base";
    $db->query($sql);
    $row = $db->fetchRow();
    return $row;
}
//======================================
// 获取注册ca数量
// 参数:  begin_limit_time     查询起始时间
//       end_limit_time       查询截至时间
// 返回: rows                  求和总数
//======================================
function get_us_sum_register_amout_info($begin_limit_time,$end_limit_time)
{
    $where ='';
    if($begin_limit_time){
        $where .= "tx_time >= '{$begin_limit_time}'";
    }
    if($end_limit_time){
        if($where){
            $where .= "AND tx_time <= '{$end_limit_time}'";
        }else{
            $where .= "tx_time <= '{$end_limit_time}'";
        }
    }
    if($where){
        $sql = "SELECT count(*) FROM us_base where '{$where}'";
    }else{
        $sql = "SELECT count(*) FROM us_base  ";
    }
    $db = new DB_COM();
//    $sql = "SELECT count(*) FROM us_base where ctime >= '{$begin_limit_time}' and ctime <= '{$end_limit_time}'";
    $db->query($sql);
    $rows = $db->fetchRow();
    return $rows;
}

/**
 * @return array
 * ccvt赠送情况
 * IG:邀请总数
 * NDAG:国庆之后送出
 * NDBG:国庆之前送出
 * NDG:国庆节送出
 */function gift_data(){
    $db = new DB_COM();
    $data = array();
    $sql_invite = "SELECT count(us_id)*50 as IG FROM us_base where invite_code!=0";
    $db->query($sql_invite);
    $rows_invite = $db->fetchRow();

    $sql_national_day = "SELECT count(us_id)*500 as NDG FROM us_base where ctime>'2018-09-30 23:59:59' and ctime<'2018-10-07 23:59:59'";
    $db->query($sql_national_day);
    $rows_national_day = $db->fetchRow();

    $sql_national_day_before = "SELECT count(us_id)*1000 as NDBG FROM us_base where ctime<'2018-09-30 23:59:59'";
    $db->query($sql_national_day_before);
    $rows_national_day_before = $db->fetchRow();

    $sql_national_day_after = "SELECT count(us_id)*50 as NDAG FROM us_base where  ctime>'2018-10-07 23:59:59'";
    $db->query($sql_national_day_after);
    $rows_national_day_after = $db->fetchRow();

    $data[] = array('t'=>$rows_invite['IG']+$rows_national_day_after['NDAG']+$rows_national_day_before['NDBG']+$rows_national_day['NDG']);
    $data[] = $rows_invite;
    $data[] = $rows_national_day;
    $data[] = $rows_national_day_before;
    $data[] = $rows_national_day_after;
    return $data;

}
