$(function () {
    //获取token
    var token = GetCookie('user_token');
    GetUsAccount();
    GetWithdrawInfo(token, function (response) {
        if(response.errcode == '0'){
            var data = response.rows;
            $('.tx_hash').text(data[0].tx_hash);
            $('.asset_id').text(data[0].asset_id);
            $('.us_account_id').text(data[0].us_account_id);
            $('.tx_time').text(data[0].tx_time);
            $('.bit_address').text(data[0].bit_address);
            if(data.qa_flag == '0'){
                $('.qa_flag').attr('name', 'enablePending');
            }
        }
    }, function (response) {
        GetErrorCode(response.errcode);
        return;
    })

});