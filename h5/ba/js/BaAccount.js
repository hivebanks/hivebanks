$(function () {
// get user token
    var token = GetCookie('ba_token');

    //Get the baseline type
    var benchmark_type = GetCookie('benchmark_type');

// get Basic user information
    GetBasicInformation(token, function (response) {
        if (response.errcode == '0') {
            $('.bit_type').text(response.bit_type);
            $('.ctime').text(response.ctime);
            $('.ba_account').text(response.ba_account);
            $('.rest_amount').text(response.base_amount);
            $('.lock_amount').text(response.lock_amount);
            $('.security_level').text(response.security_level);
            $('.rechargeNum').text(response.count_recharge);
            $('.withdrawNum').text(response.count_withdraw);
            $('.count_base_recharge').text(response.count_base_recharge);
            $('.count_base_withdraw').text(response.count_base_withdraw);
            SetCookie('ba_account', response.ba_account);
            SetCookie('ba_id', response.ba_id);
            if(benchmark_type == response.bit_type) {
                $('.recharge_amount').remove();
                $('.withdraw_amount').remove();
                $('.marginWithdrawAddressBox').remove();
                $('.setRateItem').remove();
            }
            if(benchmark_type != response.bit_type){
                $('.base_ba_address').remove();
                $('.BaMarginRechargePendingBox').remove();
                $('.BaMarginWithdrawPendingBox').remove();
            }
            if (response.recharge_rate == '0') {
                $('.setRecharge').show();
            } else {
                $('.rechargeRate').show();
                $('.recharge_rate').text(response.recharge_rate);
            }
            if (response.withdraw_rate == '0') {
                $('.setWithdraw').show();
            } else {
                $('.withdrawRate').show();
                $('.withdraw_rate').text(response.withdraw_rate);
            }
        }
    }, function (response) {
        LayerFun(response.errcode);
        if(response.errcode == '114'){
            window.location.href = 'BaLogin.html';
        }
        return;
    });

    //Get binding information
    var cellphone = '', funPass = '';
    GetBindInformation(token, function (response) {
        if(response.errcode == '0'){
            var data = response.rows;
            $.each(data, function (i, val) {
                if(data[i].bind_name == 'pass_hash' &&  data[i].bind_flag == '1'){
                    funPass = data[i].bind_name;
                }
                if(data[i].bind_name == 'cellphone' &&  data[i].bind_flag == '1'){
                    cellphone = data[i].bind_name;
                }
            })
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //add margin withdraw address or withdraw margin
    $('.withdraw_amount, .addMarginWithdrawAddress').click(function () {
        if(funPass != 'pass_hash'){
            $('#goBindFundPass').modal('show');
            return;
        }
        window.location.href = 'BaMarginWithdrawAddress.html';
    });
    //
    // //Withdrawal margin
    // $('.withdraw_amount').click(function () {
    //     if(funPass != 'pass_hash'){
    //         $('#goBindFundPass').modal('show');
    //         return;
    //     }
    //     window.location.href = 'BaWithdrawMargin.html';
    // });

    //change username
    $('.modifyNameBtn').click(function () {
        var ba_account = $('#nickName').val();
        if (ba_account.length <= 0) {
            LayerFun('pleaseEnterNickname');
            return;
        }
        ShowLoading("show");
        ModifyNickName(token, ba_account, function (response) {
            if (response.errcode == '0') {
                $('#modifyName').modal('hide');
                ShowLoading("hide");
                LayerFun('successfullyModified');
                $('.ba_account').text(response.ba_account);
                SetCookie('ba_account', response.ba_account);
                return;
            }
        }, function (response) {
            ShowLoading("hide");
            $('#modifyName').modal('hide');
            LayerFun(response.errcode);
            return;
        })
    });

// Account change record inquiry
    var api_url = 'log_balance.php', limit = 10, offset = 0, n = 0;

    function AccountChange(token, limit, offset, api_url) {
        var tr = '';
        ChangeCode(token, limit, offset, api_url, function (response) {
            if (response.errcode == '0') {
                var data = response.rows;
                if (data.length <= 0) {
                    $('.eg').hide();
                }
                var pageCount = Math.ceil(data.length / limit);
                $('.totalPage').text(pageCount);
                $.each(data, function (i, val) {
                    if(data == false){
                        GetDataEmpty('accountChangeTable', '5');
                        return;
                    }

                    tr += '<tr>' +
                        '<td><span title="' + data[i].hash_id + '">' + data[i].hash_id.substr(0, 20) + '...' + '</span></td>' +
                        '<td><span class="i18n" name="' + data[i].tx_type + '">' + data[i].tx_type + '</span></td>' +
                        '<td><span>' + data[i].tx_amount + '</span></td>' +
                        '<td><span>' + data[i].credit_balance + '</span></td>' +
                        '<td><span>' + data[i].ctime + '</span></td>' +
                        '</tr>'
                });
                $('#accountChangeTable').html(tr);
                execI18n();
                if (n == 0) {
                    Page(pageCount)
                }
                n++;
            }
        }, function (response) {
            LayerFun(response.errcode);
            GetDataFail('accountChangeTable', '5');
            return;
        })
    }

    AccountChange(token, limit, offset, api_url);

    //Pagination
    function Page(pageCount) {
        $('.change_log_code').pagination({
            pageCount: pageCount,
            callback: function (api) {
                offset = (api.getCurrent() - 1) * limit;
                $('.currentPage').text(api.getCurrent());
                AccountChange(token, limit, offset, api_url);
            }
        });
    }
});
