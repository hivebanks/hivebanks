$(function () {
    //get token
    var token = GetUsCookie('user_token');
    GetUsAccount();
    var benchmark_type = GetUsCookie('benchmark_type');
    var ca_currency = GetUsCookie('ca_currency');

    //Get the recharge amount
    var base_amount = GetQueryString('base_amount');
    var us_recharge_bit_amount = GetQueryString('bit_amount');

    //Get a list of Cas that meet the withdrawal criteria
    var api_url = 'get_ca_recharge_list_by_amount.php';
    GetMeetCaList(api_url, token, base_amount, function (response){
        if(response.errcode == '0'){
            var data = response.rows, srcArr = [], div = '';
            if(data == false){
                $('.bankBox').html('<h5 class="i18n" name="noData">noData</h5>').css('justify-content', 'center');
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
        LayerFun(response.errcode);
        return;
    });

    //Choose recharge method
    $(document).on('click', '.bankItem', function () {
        var ca_channel = $(this).find('img').attr('title');
        window.location.href = 'CaRechargeAmount.html?ca_channel=' + ca_channel + '&us_recharge_bit_amount=' + us_recharge_bit_amount;
    })
});