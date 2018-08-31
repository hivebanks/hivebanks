$(function () {
    //获取token
    var token = GetCookie('ba_token');
    GetBaAccount();

    //获取保证金提现待处理
    var type = '2', tr = '';
    GetMarginWithdrawPending(token, type, function (response) {
        if(response.errcode == '0'){
            var data = response.rows;
            if(data == false){
                GetDataEmpty('marginRechargeAlreadyTable', '4');
                return;
            }
            $.each(data, function (i, val) {
                tr+='<tr class="marginWithdrawItem">' +
                    '<td>'+ data[i].agent_id +'</td>' +
                    '<td>'+ data[i].base_amount +'</td>' +
                    '<td>'+ data[i].tx_hash +'</td>' +
                    '<td>'+ data[i].tx_time +'</td>' +
                    '<td><span class="i18n" name="processed">已处理</span></td>' +
                    '</tr>'
            });
            $('#marginRechargeAlreadyTable').html(tr);
            execI18n();
        }
    }, function (response) {
        GetDataFail('marginRechargePendingTable', '4');
        GetErrorCode(response.errcode);
        return;
    });

});