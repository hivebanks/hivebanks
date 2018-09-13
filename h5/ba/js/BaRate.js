$(function () {
    //get token；
    var token = GetCookie('ba_token');
    GetBaAccount();

    //Get the baseline type
    var benchmark_type = GetCookie('benchmark_type');

    // get Basic user information
    GetBasicInformation(token, function (response) {
        $('.base_amount').text(response.base_amount);
        $('.bit_type').text(response.bit_type);
        if (benchmark_type == response.bit_type) {
            $('.baseBaNone').remove();
            $('.baseAgentsRow').removeClass("none");
        }else {
            $('.baseAgentsRow').remove();
        }
    }, function (response) {
        if (response.errcode == '114') {
            window.location.href = 'BaLogin.html';
            return;
        }
    });

    //Recharge exchange rate setting
    $(".rechargeRateBtn").click(function () {
        var recharge_rate = $('.rechargeRateInput').val(),
            recharge_min_amount = $('.rechargeMinVal').val(),
            recharge_max_amount = $('.rechargeMaxVal').val(),
            limit_time = $('#rechargeRateTime').val(),
            recharge_us_level = $('.rechargeLevel').val(),
            pass_word_hash = hex_sha1($('#rechargePassword').val()),
            is_void = 0;
        var currentTime = CurrentTimeFun();
        if (recharge_rate <= 0 || recharge_rate.length <= 0) {
            LayerFun("pleaseEnterValidRate");
            return;
        }
        if (recharge_min_amount.length <= 0) {
            LayerFun("pleaseEnterMin");
            return;
        }
        if (recharge_max_amount.length <= 0) {
            LayerFun("pleaseEnterMax");
            return;
        }
        if ($('#rechargePassword').val().length <= 0) {
            LayerFun('passwordNotEmpty');
            return;
        }
        if (recharge_us_level.length <= 0 || recharge_us_level <= 0) {
            LayerFun('pleaseEnterVailLevel');
            return;
        }
        if (Date.parse(limit_time) <= Date.parse(currentTime)) {
            LayerFun("notLessCurrentTime");
            return;
        }
        var _this = $(this), btnText = $(this).text();
        if (DisableClick(_this)) return;
        ShowLoading("show");
        rechargeRate(token, recharge_rate, recharge_min_amount, recharge_max_amount, limit_time, is_void, recharge_us_level, pass_word_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick(_this, btnText);
                $('.rechargeRateNotSet').hide();
                LayerFun('setSuccess');
                GetRechargeRateFun();
                $('.rechargeRateInput').val("");
                $('.rechargeMinVal').val("");
                $('.rechargeMaxVal').val("");
                $('.rechargeLevel').val("");
                $('#rechargePassword').val("");
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick(_this, btnText);
            if (response.errcode == '114') {
                window.location.href = 'BaLogin.html';
                return;
            }
            LayerFun('setFail');
            LayerFun(response.errcode);
            return;
        })
    });

    //Get recharge rate
    function GetRechargeRateFun() {
        GetRechargeRate(token, function (response) {
            if (response.errcode == '0') {
                if (response.recharge_base_rate) {
                    $('.rechargeShowRate').removeClass('none');
                }
                $('.recharge_rate').text(response.recharge_base_rate);
                $('.recharge_max_amount').text(response.recharge_max_amount);
                $('.recharge_min_amount').text(response.recharge_min_amount);
                $('.recharge_set_time').text(response.recharge_limit_time);
                if (!response.recharge_base_rate) {
                    $('.rechargeNotSet').show();
                    $('.currentRechargeRateBox').hide();
                } else {
                    $('.rechargeNotSet').hide();
                    $('.currentRechargeRateBox').css('display', 'flex');
                }
            }
        }, function (response) {
            if (response.errcode == '114') {
                window.location.href = 'BaLogin.html';
                return;
            }
            LayerFun(response.errcode);
            return;
        });
    }

    GetRechargeRateFun();

    //withtraw exchange rate setting
    $(".withdrawRateBtn").click(function () {
        var withdraw_rate = $('.withdrawRateInput').val(),
            withdraw_min_amount = $('.withdrawMinVal').val(),
            withdraw_max_amount = $('.withdrawMaxVal').val(),
            limit_time = $('#withdrawRateTime').val(),
            withdraw_us_level = $('.withdrawLevel').val(),
            pass_word_hash = hex_sha1($('#withdrawPassword').val()),
            is_void = 0;
        var currentTime = CurrentTimeFun();
        if (withdraw_rate <= 0 || withdraw_rate.length <= 0) {
            LayerFun("pleaseEnterValidRate");
            return;
        }
        if (withdraw_min_amount.length <= 0) {
            LayerFun("pleaseEnterMin");
            return;
        }
        if (withdraw_max_amount.length <= 0) {
            LayerFun("pleaseEnterMax");
            return;
        }
        if ($('#withdrawPassword').val().length <= 0) {
            LayerFun('passwordNotEmpty');
            return;
        }
        if (withdraw_us_level.length <= 0 || withdraw_us_level <= 0) {
            LayerFun('pleaseEnterVailLevel');
            return;
        }
        if (Date.parse(limit_time) <= Date.parse(currentTime)) {
            LayerFun("notLessCurrentTime");
            return;
        }
        var _this = $(this), btnText = $(this).text();
        if (DisableClick(_this)) return;
        ShowLoading("show");
        withdrawRate(token, withdraw_rate, withdraw_min_amount, withdraw_max_amount, limit_time, is_void, withdraw_us_level, pass_word_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick(_this, btnText);
                $('.withdrawRateNotSet').hide();
                LayerFun('setSuccess');
                GetWithdrawRateFun();
                $('.withdrawRateInput').val("");
                $('.withdrawMinVal').val("");
                $('.withdrawMaxVal').val("");
                $('.withdrawLevel').val("");
                $('#withdrawPassword').val("");
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick(_this, btnText);
            if (response.errcode == '114') {
                window.location.href = 'BaLogin.html';
                return;
            }
            LayerFun(response.errcode);
            LayerFun('setFail');
            return;
        })
    });

    //Get the withdrawal rate
    function GetWithdrawRateFun() {
        GetWithdrawRate(token, function (response) {
            if (response.errcode == '0') {
                if (response.withdraw_base_rate) {
                    $('.withdrawShowRate').removeClass('none');
                }
                $('.withdraw_max_amount').text(response.withdraw_max_amount);
                $('.withdraw_min_amount').text(response.withdraw_min_amount);
                $('.withdraw_set_time').text(response.withdraw_limit_time);
                if (!response.withdraw_base_rate) {
                    $('.withdrawNotSet').show();
                    $('.currentWithdrawRateBox').hide();
                } else {
                    $('.withdrawNotSet').hide();
                    $('.currentWithdrawRateBox').css('display', 'flex');
                }
            }
        }, function (response) {
            if (response.errcode == '114') {
                window.location.href = 'BaLogin.html';
                return;
            }
            LayerFun(response.errcode);
            return;
        });
    }

    GetWithdrawRateFun();

    //Set time
    $('#withdrawRateTime,#rechargeRateTime').datetimepicker({
        initTime: new Date(),
        format: 'Y/m/d H:i',
        value: new Date(),
        minDate: new Date(),//Set minimum date
        minTime: new Date(),//Set minimum time
        yearStart: 2018,//Set the minimum year
        yearEnd: 2050 //Set the maximum year
    });
});