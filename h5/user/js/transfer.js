$(function(){
    GetUsAccount();
    // 转入/转出记录
    var token = GetCookie('user_token'),
    limit = 0,offset = 5,
    trans_api_url = 'log_balance.php',
    us_in_out_arr=[];
    AllRecord(token,limit,offset,trans_api_url,function (response){
        if(response.errcode == '0'){
            var data = response.rows;
            // 循环结果进行筛选
            $.each(data,function (i,val){
                if(data[i].chg_type == 'us_in' || data[i].chg_type == 'us_out'){
                    us_in_out_arr.push($(this)[0]);
                }
            });
            new Vue({
                el:'#transferCodes',
                data:{
                    usChangeCodes:us_in_out_arr
                }
            });
            execI18n();
        }
    },function (response){
        execI18n();
        layer.msg(response.errcode);
        if($('.ctime').text() == '{{item.ctime}}'){
            $('.historyCode').hide();
        }
        if(response.errcode == '114'){
            window.location.href = 'login.html';
        }
    });












    $("#payNumber").val("622021718011398167")
});