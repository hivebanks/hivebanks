<?php
//======================================
// 函数: 获取账户变动录记录总数
// 参数: us_id        用户id
// 返回: count        记录总数
//======================================
function  get_log_balance_total($us_id)
{
    $db = new DB_COM();
    $sql = "SELECT hash_id FROM com_base_balance WHERE credit_id = '{$us_id}'";//fzg:hash_id=>credit_id
    $db -> query($sql);
    $count = $db -> affectedRows();
    return $count;
}
//======================================
// 函数: 获取账户变动记录
// 参数: us_id            用户id
// 返回: rows             用户登录信息数组
//        chg_type           变动类型(ca_in/out:CA充值提现，ba_in/out:BA充值提现，us_in/out:用户转入转出)
//        chg_amount         变动金额
//        chg_balance        变动后账户余额
//        prvs_hash          交易HASH
//        ctime              变动时间
//======================================
function get_log_balance($us_id,$offset,$limit)
{
  $db = new DB_COM();
  $sql = "SELECT * FROM com_base_balance WHERE credit_id = '{$us_id}' order by ctime desc limit $offset , $limit";//fzg:hash_id=>credit_id
  $db->query($sql);
  $rows = $db->fetchAll();
  return $rows;
}
