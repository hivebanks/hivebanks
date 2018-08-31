$(function () {
    //获取token
    var token = GetCookie('user_token');
    GetUsAccount();
    GetWithdrawInfo(token, function (response) {
        if(response.errcode == '0'){
            var data =response.rows;
            if(data[0].qa_flag == '0'){
                $('.enablePending').attr('name', 'enablePending');
                execI18n();
            }
            $('.tradingHash').text(data[0].tx_hash);
            $('.caWithdrawAmount').text(data[0].lgl_amount);
            $('.handlingFee').text(data[0].tx_fee);
            $('.time').text(data[0].tx_time);
        }
    }, function (response) {
        GetErrorCode(response.errcode);
    })

});