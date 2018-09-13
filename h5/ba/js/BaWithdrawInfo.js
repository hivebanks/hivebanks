$(function () {
    //get token
    var token = GetCookie('user_token');
    GetUsAccount();
    GetWithdrawInfo(token, function (response) {
        if(response.errcode == '0'){
            var data = response.rows;
            $('.tx_hash').text(data[0].tx_hash);
            $('.asset_id').text(data[0].asset_id);
            $('.bit_amount').text(data[0].bit_amount);
            $('.tx_time').text(data[0].tx_time);
            $('.bit_address').text(data[0].bit_address);
            if(data.qa_flag == '0'){
                $('.qa_flag').attr('name', 'enablePending');
            }
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    })

});