$(function () {
    //get token
    var token = GetCookie('ba_token');
    GetBaAccount();

    //Get margin withdrawal pending
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
                    '<td><input type="text" class="form-control  "></td>' +
                    '<td><span class="i18n" name="processed">processed</span></td>' +
                    '</tr>'
            });
            $('#marginRechargeAlreadyTable').html(tr);
        }
    }, function (response) {
        GetDataFail('marginRechargeAlreadyTable', '4');
        LayerFun(response.errcode);
        return;
    });

});