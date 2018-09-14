$(function () {
    var token = GetCookie('ba_token'), limit = 10, offset = 0;
    GetBaAccount();

    //Get the baseline type
    var base_type = GetCookie('benchmark_type');

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
    //Get a list of user refill pending orders
    var api_url = 'log_us_recharge.php', type = '1', tr = '';
    RechargeWithdrawCodeQuery(token, api_url, type, function (response) {
        if (response.errcode == '0') {
            var data = response.rows;
            if(data == false){
                GetDataEmpty('rechargePendingTable', '6');
                return;
            }
            $.each(data, function (i, val) {
                tr += '<tr class="rechargePendingList">' +
                    '<td><span>' + data[i].us_id + '</span></td>' +
                    '<td><span>' + data[i].base_amount + '</span></td>' +
                    '<td><span>' + data[i].asset_id + '</span>/<span>' + base_type + '</span></td>' +
                    '<td><span>' + data[i].bit_address + '</span></td>' +
                    '<td><span>' + data[i].tx_time + '</span></td>' +
                    '<td>' +
                    '<a class="btn btn-success btn-sm confirmBtn">' +
                    '<span class="i18n" name="handle">handle</span>' +
                    '</a>' +
                    '<span class="qa_id none">' + data[i].qa_id + '</span>' +
                    '</td>' +
                    '</tr>'
            });
            $('#rechargePendingTable').html(tr);
            execI18n();
        }
    }, function (response) {
        GetDataFail('rechargePendingTable', '6');
        LayerFun(response.errcode);
        return;
    });

    //Cash withdrawal confirmation processing
    var qa_id = '', _this = '';
    $(document).on('click', '.confirmBtn', function () {
        $('#confirmModal').modal('show');
        qa_id = $(this).next('.qa_id').text();
        _this = $(this);
    });
    $('.againConfirmBtn').click(function () {
        var type = '1', $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        RechargeConfirm(token, qa_id, type, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                $('#confirmModal').modal('hide');
                _this.closest('.rechargePendingList').remove();
                $('.lock_amount').text(response.lock_amount);
                LayerFun('suc_processing');
                return;
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
            return;
        })
    })
});
