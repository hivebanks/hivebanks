<?php
//======================================
// 函数: 获取基准ba充值金额请求通过ba_id
// 参数: ba_id                 baID
// 返回: count                 信息数组
//======================================
function  get_base_recharge_amount_request_ba_id($ba_id)
{
    $db = new DB_COM();
    $sql = "SELECT count(*) FROM base_recharge_request WHERE base_id = '{$ba_id}' and qa_flag = 0";
    $db -> query($sql);
    $count = $db -> fetchRow();
    return $count;
}
