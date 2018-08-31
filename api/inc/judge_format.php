<?php
//======================================
//判断是否是正确的邮箱格式
// 参数: $email       email地址
// 返回: true         真
//       false        假
//======================================
function isEmail($email){
    $mode = '/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/';
    if(preg_match($mode,$email)){
        return true;
    }
    else{
        return false;
    }
}

//======================================
//判断是否是正确的手机格式
// 参数: $cellphone    手机号码
// 返回: true         真
//       false        假
//======================================
function isPhone($cellphone){
    $mode = "/^1[34578]{1}\d{9}$/";
    if(preg_match($mode,$cellphone)){
        return true;
    }else{
        return false;
    }
}
//======================================
//判断是否是正确的ip地址
// 参数: $ip_add        ip地址
// 返回: true         真
//       false        假
//======================================
function isip($ip_add){
    $mode = '((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))';
    if(preg_match($mode,$ip_add)){
        return true;
    }else{
        return false;
    }
}

//==============================================
//函数 :  判断身份证号是否正确
//参数 : $idNum      身份证号
//返回 : ture        正确
//       false       错误
function is_idcard($id)
{
    $id = strtoupper($id);
    $regx = "/(^\d{15}$)|(^\d{17}([0-9]|X)$)/";
    $arr_split = array();
    if(!preg_match($regx, $id))
    {
        return FALSE;
    }
    if(15==strlen($id)) //检查15位
    {
        $regx = "/^(\d{6})+(\d{2})+(\d{2})+(\d{2})+(\d{3})$/";

        @preg_match($regx, $id, $arr_split);
        //检查生日日期是否正确
        $dtm_birth = "19".$arr_split[2] . '/' . $arr_split[3]. '/' .$arr_split[4];
        if(!strtotime($dtm_birth))
        {
            return FALSE;
        } else {
            return TRUE;
        }
    }
    else      //检查18位
    {
        $regx = "/^(\d{6})+(\d{4})+(\d{2})+(\d{2})+(\d{3})([0-9]|X)$/";
        @preg_match($regx, $id, $arr_split);
        $dtm_birth = $arr_split[2] . '/' . $arr_split[3]. '/' .$arr_split[4];
        if(!strtotime($dtm_birth)) //检查生日日期是否正确
        {
            return FALSE;
        }
        else
        {
            //检验18位身份证的校验码是否正确。
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            $arr_int = array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            $arr_ch = array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            $sign = 0;
            for ( $i = 0; $i < 17; $i++ )
            {
                $b = (int) $id{$i};
                $w = $arr_int[$i];
                $sign += $b * $w;
            }
            $n = $sign % 11;
            $val_num = $arr_ch[$n];
            if ($val_num != substr($id,17, 1))
            {
                return FALSE;
            } //phpfensi.com
            else
            {
                return TRUE;
            }
        }
    }

}
//=============================================
// 函数 : 判断是否为中文名
// 参数 : $name   姓名
// 返回 : ture    正确
//        false   错误
function isChineseName($name){
    if (preg_match('/^([\xe4-\xe9][\x80-\xbf]{2}){2,4}$/', $name)) {
        return true;
    } else {
        return false;
    }
}


//=====================================================
// 函数:判断密码强度
// 参数 : $pass_word   密码
// 返回 : $score       密码强度数
function Determine_password_strength($pass_word)
{
    $score = 0;
    if($pass_word){ //接收的值
        $str = $pass_word;
    } else{
        exit_error('10','密码格式不正确');
    }
    if(preg_match("/[0-9]+/",$str))
    {
        $score ++;
    }
    if(preg_match("/[0-9]{3,}/",$str))
    {
        $score ++;
    }
    if(preg_match("/[a-z]+/",$str))
    {
        $score ++;
    }
    if(preg_match("/[a-z]{3,}/",$str))
    {
        $score ++;
    }
    if(preg_match("/[A-Z]+/",$str))
    {
        $score ++;
    }
    if(preg_match("/[A-Z]{3,}/",$str))
    {
        $score ++;
    }
    if(preg_match("/[_|\-|+|=|*|!|@|#|$|%|^|&|(|)]+/",$str))
    {
        $score += 2;
    }
    if(preg_match("/[_|\-|+|=|*|!|@|#|$|%|^|&|(|)]{3,}/",$str))
    {
        $score ++ ;
    }
    if(strlen($str) < 8 )
    {
        $score = 0;
    }else{
        $score ++;
    }
    return $score;
}
//=============================================
// 函数 : 判断银行卡格式是否正确
// 参数 : $bankCard     银行卡号
// 返回 : ture    正确
//        false   错误
//=================================================

function check_bankCard($card_number){
    $arr_no = str_split($card_number);
    $last_n = $arr_no[count($arr_no)-1];
    krsort($arr_no);
    $i = 1;
    $total = 0;
    foreach ($arr_no as $n){
        if($i%2==0){
            $ix = $n*2;
            if($ix>=10){
                $nx = 1 + ($ix % 10);
                $total += $nx;
            }else{
                $total += $ix;
            }
        }else{
            $total += $n;
        }
        $i++;
    }
    $total -= $last_n;
    $x = 10 - ($total % 10);
    if($x == $last_n){
        return 'true';
    }else{
        return 'false';
    }
}



?>
