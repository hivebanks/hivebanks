$(function () {
    //get token
    var token = GetCookie('ba_token');
    GetBaAccount();

    // get Basic user information
    GetBasicInformation(token, function (response) {
        if (response.errcode == '0') {
            $('.bit_type').text(response.bit_type);
            $('.base_amount').text(response.base_amount);
            $('.lock_amount').text(response.lock_amount);
        }
    }, function (response) {
        return;
    });

    //Get margin withdrawal pending
    var type = '1', tr = '';
    GetMarginWithdrawPending(token, type, function (response) {
        if (response.errcode == '0') {
            var data = response.rows;
            if (data == false) {
                GetDataEmpty('marginWithdrawPendingTable', '5');
                return;
            }
            $.each(data, function (i, val) {
                tr += '<tr class="marginWithdrawItem">' +
                    '<td>' + data[i].agent_id + '</td>' +
                    '<td>' + data[i].base_amount + '</td>' +
                    // '<td>'+ data[i].base_amount +'</td>' +
                    '<td>' + data[i].tx_time + '</td>' +
                    '<td><input type="text" class="form-control tradingHash"></td>' +
                    '<td>' +
                    '<a class="btn btn-success btn-sm confirmBtn">' +
                    '<span class="i18n" name="handle">handle</span>' +
                    '</a>' +
                    '<span class="qa_id none">' + data[i].qa_id + '</span>' +
                    '</td>' +
                    '</tr>'
            });
            $('#marginWithdrawPendingTable').html(tr);
        }
    }, function (response) {
        GetDataFail('marginRechargePendingTable', '5');
        LayerFun(response.errcode);
        return;
    });

    //Confirm processing margin withdrawal
    $(document).on('click', '.confirmBtn', function () {
        var type = '1', qa_id = $(this).parents('.marginWithdrawItem').find('.qa_id').text(),
            transfer_tx_hash = $(this).parents('.marginWithdrawItem').find('.tradingHash').val();
        if (transfer_tx_hash.length <= 0) {
            LayerFun('inputHash');
            return;
        }
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        MarginWithdrawConfirm(token, type, qa_id, transfer_tx_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                $this.closest('.marginWithdrawItem').remove();
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
        })
    })
});