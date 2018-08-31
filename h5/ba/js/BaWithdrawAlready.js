$(function(){
    //获取token
    var token = GetCookie('ba_token');
    GetBaAccount();

    //获取基准类型
    var base_type = GetCookie('benchmark_type');

    //获取用户充值已处理订单列表
    var api_url = 'log_us_withdraw.php', type = '2', tr = '', tx_hash = [], limit = 10, offst = 0;
    RechargeWithdrawCodeQuery(token, api_url, type, function (response){

        if(response.errcode == '0'){
            var data = response.rows;
            if(data.length <= 0){
                GetDataEmpty('withdrawPendingTable', '7');
                return;
            }
            $.each(data, function (i, val) {
                tr += '<tr class="withdrawPendingList">' +
                    '<td>' + data[i].us_id + '</td>' +
                    '<td>' + data[i].base_amount + '</td>' +
                    '<td><span>' + data[i].asset_id + '</span>/<span>' + base_type + '</span></td>' +
                    '<td><span>' + data[i].bit_address + '</span></td>' +
                    '<td><span>' + data[i].tx_time + '</span></td>' +
                    '<td><input type="text" class="form-control tx_hash"></td>' +
                    '<td><span class="i18n" name="processed">已处理</span></td>' +
                    '</tr>'
            });
            $('#withdrawPendingTable').html(tr);
            execI18n();
        }
    },function (response){
        GetDataFail('withdrawPendingTable');
        GetErrorCode(response.errcode);
        return;
    });
});