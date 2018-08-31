$(function () {
    //获取token
    var token = GetUsCookie('user_token');
    GetUsAccount();
    var benchmark_type = GetUsCookie('benchmark_type');
    var ca_currency = GetUsCookie('ca_currency');

    //获取充值金额
    var base_amount = GetQueryString('us_ca_withdraw_amount');

    //获取符合提现条件的Ca
    var api_url = 'get_ca_withdraw_list_by_amount.php';
    GetMeetWithdrawCaList(api_url, token, base_amount, function (response){
        if(response.errcode == '0'){
            var data = response.rows, srcArr = [], div = '';
            if(data == false){
                $('.bankBox').html('<h5 class="i18n" name="noData">暂无数据</h5>').css('justify-content', 'center');
                execI18n();
                return;
            }
            $.each(data, function (i, val) {
                div+='<div class="imgBox width-20 bankItem">' +
                    '<img src="img/' + data[i].ca_channel.toLowerCase() + '.png" alt="" title="'+ data[i].ca_channel +'">' +
                    '<div class="rechargeRateText">' +
                    '<span>1' +
                    '<span class="base_amount">'+ benchmark_type +'</span>=' +
                    '<span class="base_rate">'+ data[i].base_rate +'</span>' +
                    '<span class="bit_amount ca_currency">'+ ca_currency +'</span>' +
                    '</span>' +
                    '</div>' +
                    '</div>'
            });
            $('.bankBox').html(div);
            execI18n();
        }
    }, function (response){
        GetErrorCode(response.errcode);
        return;
    });

    //选择充值方式
    $(document).on('click', '.bankItem', function () {
        var ca_channel = $(this).find('img').attr('title');

        //获取us_account_id
        var us_account_id = '';
        GetUsAccountId(token, ca_channel, function (response){
            if(response.errcode == '0'){
                var data = response.rows[0];
                us_account_id = data.account_id;
                return;
            }
        }, function (response) {
            if(response.errcode == '120'){
                $('#notBingBank').modal('show');
                return;
            }
        });
        window.location.href = 'CaWithdrawAmount.html?us_ca_withdraw_amount='+ base_amount + '&ca_channel=' + ca_channel;
    })
});