$(function(){
   var token = GetCookie('ba_token');
    GetBaAccount();

    //Get the baseline type
    var base_type = GetCookie('benchmark_type');

    //Get user recharged processed order list
    var api_url = 'log_us_recharge.php', type = '2', tr = '', limit = 10, offst = 0;
    RechargeWithdrawCodeQuery(token, api_url, type, function (response){
        if (response.errcode == '0') {
            var data = response.rows;
            if(data == ''){
                GetDataEmpty('rechargePendingTable', '6');
                return;
                return;
            }
            $.each(data, function (i, val) {
                tr += '<tr class="rechargePendingList">' +
                    '<td><span>' + data[i].us_id + '</span></td>' +
                    '<td><span>' + data[i].base_amount + '</span></td>' +
                    '<td><span>' + data[i].asset_id + '</span>/<span>' + base_type + '</span></td>' +
                    '<td><span>' + data[i].bit_address + '</span></td>' +
                    '<td><span>' + data[i].tx_time + '</span></td>' +
                    '<td><span class="i18n" name="processed">processed</span></td>' +
                    '</tr>'
            });
            $('#rechargePendingTable').html(tr);
            execI18n();
        }
    },function (response){
        GetDataFail('rechargePendingTable', '6');
        LayerFun(response.errcode);
        return;
    });
});