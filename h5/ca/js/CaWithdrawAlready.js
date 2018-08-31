$(function(){
    var token = GetCookie('ca_token');
    var benchmark_type = GetUsCookie('benchmark_type');
    var ca_currency = GetUsCookie('ca_currency');
    GetCaAccount();

    //获取用户充值已处理订单列表
    var api_url = 'log_us_withdraw.php', type = '2', tr = '', bit_address=[], tx_hash = [], limit = 10, offst = 0;
    GetRechargeWithdrawList(api_url, token, type, function (response){

        if(response.errcode == '0'){
            var data = response.rows;
            if(data == false){
                GetDataEmpty('withdrawPendingTable', '6');
                return;
            }
            $.each(data, function (i, val) {
                tr += '<tr class="withdrawPendingList">' +
                    '<td>' + data[i].us_id + '</td>' +
                    '<td>' + data[i].base_amount + '</td>' +
                    '<td><span>' + benchmark_type + '</span>/<span>'+ ca_currency +'</span></td>' +
                    // '<td><span>' + data[i].bit_address + '</span></td>' +
                    '<td><span>' + data[i].tx_time + '</span></td>' +
                    '<td><input type="text" class="form-control tx_hash"></td>' +
                    '<td><span class="i18n" name="processed">已处理</span></td>' +
                    '</tr>'
            });
            $('#withdrawPendingTable').html(tr);
            execI18n();
        }
    },function (response){
        GetDataFail('withdrawPendingTable', '6');
        GetErrorCode(response.errcode);
        return;
    });
});