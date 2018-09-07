$(function(){
    var token = GetCookie('ca_token');
    GetCaAccount();
    //Get user recharged processed order list
    var api_url = 'log_us_recharge.php', type = '2', tr = '', bit_address=[], tx_hash = [], limit = 10, offst = 0;
    GetRechargeWithdrawList(api_url, token, type, function (response){
        if (response.errcode == '0') {
            var data = response.rows;
            if(data == false){
                GetDataEmpty('rechargePendingTable', '5');
                return;
            }
            $.each(data, function (i, val) {
                tr += '<tr class="rechargePendingList">' +
                    '<td><span>' + data[i].us_id + '</span></td>' +
                    '<td><span>' + data[i].base_amount + '</span></td>' +
                    '<td><span class="ca_currency">CNY</span>/<span>' + 'BTC' + '</span></td>' +
                    // '<td><span>' + data[i].bit_address + '</span></td>' +
                    '<td><span>' + data[i].tx_time + '</span></td>' +
                    '<td><span class="" name="">已处理</span></td>' +
                    '</tr>'
            });
            $('#rechargePendingTable').html(tr);
        }
    },function (response){
        GetDataFail('rechargePendingTable');
        LayerFun(response.errcode);
        return;
        // tr += '<tr>' +
        //     '<td colspan="6">' + '数据加载失败' + '</td>' +
        //     '</tr>';
        // $('#rechargePendingTable').html(tr);
    });
});