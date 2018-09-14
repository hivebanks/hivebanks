$(function () {
    var token = GetCookie('ca_token'), limit = 10, offset = 0;
    var benchmark_type = GetUsCookie('benchmark_type');
    var ca_currency = GetUsCookie('ca_currency');
    GetCaAccount();

    // get Basic user information
    GetCaInformation(token, function (response) {
        if (response.errcode == '0') {
            $('.bit_type').text(response.bit_type);
            $('.base_amount').text(response.base_amount);
            $('.lock_amount').text(response.lock_amount);
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //Get a list of user withdrawal pending orders
    var api_url = 'log_us_withdraw.php', type = '1', bit_address = [], tr = '';
    GetRechargeWithdrawList(api_url, token, type, function (response) {
        if (response.errcode == '0') {
            var data = response.rows;
            if(data == false){
                GetDataEmpty('withdrawPendingTable', '5');
                return;
            }
            $.each(data, function (i, val) {
                tr += '<tr class="withdrawPendingList">' +
                    '<td>' + data[i].us_id + '</td>' +
                    '<td>' + data[i].base_amount + '</td>' +
                    '<td><span>' + benchmark_type + '</span>/<span class="ca_currency">'+ ca_currency +'</span></td>' +
                    // '<td><span>' + data[i].bit_address + '</span></td>' +
                    '<td><span>' + data[i].tx_time + '</span></td>' +
                    '<td><input type="text" class="form-control transfer_tx_hash"></td>' +
                    '<td>' +
                    '<a class="btn btn-success btn-sm confirmBtn">' +
                    '<span class="i18n" name="handle">handle</span>' +
                    '</a>' +
                    '<span class="qa_id none">' + data[i].qa_id + '</span>' +
                    '</td>' +
                    '</tr>';
            });
            $('#withdrawPendingTable').html(tr);
            execI18n();
        }
    }, function (response) {
        GetDataFail('withdrawPendingTable', '5');
        LayerFun(response.errcode);
        return;
    });
    //Withdrawal request confirmation processing
    var qa_id = '', _this = '', transfer_tx_hash = '';
    $(document).on('click', '.confirmBtn', function () {
        transfer_tx_hash = $(this).parents('.withdrawPendingList').find('.transfer_tx_hash').val();
        if (transfer_tx_hash.length <= 0) {
            LayerFun('inputHash');
            return;
        }
        $('#confirmModal').modal('show');
        qa_id = $(this).next('.qa_id').text();
        _this = $(this);
    });

    //again confirm
    $('.againConfirmBtn').click(function () {
        var type = '1';
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        ShowLoading("show");
        WithdrawConfirm(token, qa_id, type, transfer_tx_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                $('#confirmModal').modal('hide');
                _this.closest('.withdrawPendingList').remove();
                $('.lock_amount').text(response.lock_amount);
                LayerFun("successfulProcessing");
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun("processingFailure");
            return;
        })
    })
});

