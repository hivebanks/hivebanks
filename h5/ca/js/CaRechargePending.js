$(function () {
    var token = GetCookie('ca_token'), limit = 10, offset = 0;
    GetCaAccount();
    // get Basic user information
    GetCaInformation(token, function (response) {
        if (response.errcode == '0') {
            $('.bit_type').text(response.bit_type);
            $('.base_amount').text(response.base_amount);
            $('.lock_amount').text(response.lock_amount);
        }
    }, function (response) {
        return;
    });
    //Get a list of user refill pending orders
    var api_url = 'log_us_recharge.php', type = '1', tr = '', bit_address = [], tx_hash = [];
    GetRechargeWithdrawList(api_url, token, type, function (response) {
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
                    '<td>' +
                    '<a class="btn btn-success btn-sm confirmBtn">' +
                    '<span class="i18n" name="confirmations">Confirmations</span>' +
                    '</a>' +
                    '<span class="qa_id none">' + data[i].qa_id + '</span>' +
                    '</td>' +
                    '</tr>'
            });
            $('#rechargePendingTable').html(tr);
        }
    }, function (response) {
        GetDataFail('rechargePendingTable', '5');
        LayerFun(response.errcode);
        return;
    });

    //充值确认处理
    var qa_id = '', _this = '';
    $(document).on('click', '.confirmBtn', function () {
        $('#confirmModal').modal('show');
        qa_id = $(this).next('.qa_id').text();
        _this = $(this);
    });
    $('.againConfirmBtn').click(function () {
        var type = '1';
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        RechargeConfirm(token, qa_id, type, function (response) {
            if (response.errcode == '0') {
                ActiveClick($this, btnText);
                $('#confirmModal').modal('hide');
                _this.closest('.rechargePendingList').remove();
                $('.lock_amount').text(response.lock_amount);
                layer.msg('<p class="i18n" name="suc_processing">处理成功</p>');
                execI18n();
            }
        }, function (response) {
            ActiveClick($this, btnText);
            layer.msg('<p class="i18n" name="err_processing">处理失败</p>');
            execI18n();
            LayerFun(response.errcode);
            return;
        })
    })
});

