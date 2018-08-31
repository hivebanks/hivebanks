$(function () {
    //获取token
    var token = GetUsCookie('user_token');
    var us_level = GetUsCookie('us_level');
    GetUsAccount();

    //获取参数
    var bit_type = GetUsCookie('wi_bit_type');

    $('.bit_type').text(bit_type);

    //获取分配的ba/
    var api_url = 'assign_withdraw_ba.php', ba_id = '', base_rate = '', max_amount = '', min_amount = '';
    GetBaItem(api_url, token, bit_type, function (response) {
        if (response.errcode == '0') {
            ba_id = response.ba_id;
            base_rate = response.base_rate;
            max_amount = response.max_amount;
            min_amount = response.min_amount;
            $('.base_rate').text(response.base_rate);
            $('.withdraw_max_amount').text(response.max_amount);
            $('.withdraw_min_amount').text(response.min_amount);
            $('.withdrawAmount').val(response.min_amount);
            $('.withdraw_ctime').text(response.set_time);
            if (base_rate <= 0) {
                $('.bit_amount_input').val(0);
            } else {
                $('.bit_amount_input').val(Number(min_amount) / Number(base_rate));
            }
        }
    }, function (response) {
        GetErrorCode(response.errcode);
    });
    //获取用户账户余额，可用于最大提现额度
    var us_base_amount = '';
    GetUserBaseInfo(token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows;
            us_base_amount = data.base_amount;
            $('.base_amount').text(data.base_amount);
            if (us_base_amount <= 0 || us_base_amount < min_amount) {
                $('.allWithdraw').remove();
                $('.no_base_amount').show();
            }
        }
    }, function (response) {
        GetErrorCode(response.errcode);
    });

    //全部提现
    $('.allWithdraw').click(function () {
        $('.base_amount_input').val(us_base_amount);
        $('.bit_amount_input').val(us_base_amount / base_rate);
    });

    //检查用户绑定信息
    var cellphone = '', phone_bind_info = '', fundPass = '';
    CheckUserBindInfo(token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows;
            $.each(data, function (i, val) {
                if (data[i].bind_name == 'cellphone') {
                    cellphone = data[i].bind_name;
                    phone_bind_info = data[i].bind_info;
                    $('.phone_bind_info_input').val(data[i].bind_info);
                }

                if (data[i].bind_name == 'pass_hash') {
                    fundPass = data[i].bind_name;
                }

            })
        }
    }, function (response) {
        GetErrorCode(response.errcode);
    });

    //手动添加地址
    $('.manualAddAddress').click(function () {
        if (cellphone == 'cellphone') {
            $('#smsPhoneCode').modal('show');
        } else {
            $('#goBindPhoto').modal('show');
        }
    });

    //  确认添加地址
    $('.addAddressBtn').click(function () {
        var bit_address = $('.bit_address').val(), pass_word_hash = hex_sha1($('#password').val());
        ConfirmAddAddress(token, bit_type, bit_address, pass_word_hash, function (response) {
            if (response.errcode == '0') {
                LayerFun('addAddressSuccess');
                $('#addAddress').modal('hide');
                $('.withdrawAddressInput').val(response.rows);
            }
        }, function (response) {
            if (response.errcode == '120') {
                LayerFun('passwordError');
                return;
            }
            GetErrorCode(response.errcode);
            return;
        })

    });

    //点击锁定提现金额
    var base_amount = '', bit_amount = '', bit_address = '';
    $('.lockWithdrawAmount').click(function () {
        bit_amount = $('.bit_amount_input').val();
        base_amount = $('.base_amount_input').val();
        bit_address = $('.withdrawAddressInput').val();
        if (us_base_amount < min_amount) {
            LayerFun('notBalance');
            return;
        }
        if (bit_address.length <= 0) {
            LayerFun('widthAddressNotEmpty');
            return;
        }
        if (base_amount.length <= 0) {
            LayerFun('widthAmountNotEmpty');
            return;
        }
        if (base_amount <= min_amount) {
            LayerFun('notSmallAmount');
            return;
        }
        if (base_amount >= max_amount) {
            LayerFun('notLagAmount');
            return;
        }
        if (fundPass != 'pass_hash') {
            $('#goBindFundPass').modal('show');
            return;
        } else {
            $('#lockWithdrawAmount').modal('show');
        }
    });
    //验证资金密码正确性(先发送请求)
    $('.verifyBtn').click(function () {
        var fundPass = $('.fundPassword').val(), cfm_fundPass = hex_sha1(fundPass);
        if (fundPass.length <= 0) {
            LayerFun('fundPassNotEmpty');
            return;
        }

        CfmFundPass(token, cfm_fundPass, function (response) {
            if (response.errcode == '0') {
                LockWithdraw(token, ba_id, base_amount, bit_type, bit_amount, us_level, bit_address, function (response) {
                    if (response.errcode == '0') {
                        LayerFun('waitingPro');
                        window.location.href = 'BaWithdrawInfo.html';
                    }
                }, function (response) {
                    GetErrorCode(response.errcode);
                    return;
                });
            }
        }, function (response) {
            if (response.errcode == '105') {
                LayerFun('fundPassError');
                return;
            }
            GetErrorCode(response.errcode);
            return;
        });

    });

    //获取手机验证码
    $('.phoneCodeBtn').click(function () {
        var bind_type = '5', phoneArr = phone_bind_info.split('-'),
            country_code = phoneArr[0], cellphone = phoneArr[1];
        BaGetPhoneCode(cellphone, country_code, bind_type, function (response) {
            if (response.errcode == '0') {
                LayerFun('queryCodeSuccess');
                return;
            }
        }, function (response) {
            LayerFun('queryCodeFail');
            GetErrorCode(response.errcode);
            return;
        });
    });
    //验证手机验证码
    $('.enablePhoneBtn').click(function () {
        var sms_code = $('#smsCode').val(), phone_info = phone_bind_info.split('-'),
            country_code = phone_info[0], cellphone = phone_info[1];
        CfmPhone(sms_code, country_code, cellphone, function (response) {
            if (response.errcode == '0') {
                LayerFun('verifySuccess');
                $('#smsPhoneCode').modal('hide');
                $('#addAddress').modal('show');
            }
        }, function (response) {
            GetErrorCode(response.errcode);
            return;
        })
    });
    //绑定输入框变动
    $('.base_amount_input').bind('input porpertychange', function () {
        if (base_rate <= 0) {
            $('.bit_amount_input').val(0);
        } else {
            $('.bit_amount_input').val($('.base_amount_input').val() / base_rate);
        }
    });
    $('.bit_amount_input').bind('input porpertychange', function () {
        if (base_rate <= 0) {
            $('.base_amount_input').val(0);
        } else {
            $('.base_amount_input').val($('.bit_amount_input').val() * base_rate);
        }
    });
});