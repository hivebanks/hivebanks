$(function () {
    //获取token；
    var token = GetCookie('ba_token');
    GetBaAccount();

    //获取基准类型
    var benchmark_type = GetCookie('benchmark_type');

    // 获取用户基本信息
    GetBasicInformation(token, function (response) {
        $('.base_amount').text(response.base_amount);
        $('.bit_type').text(response.bit_type);
        if(benchmark_type == response.bit_type) {
            $('#rate .container').remove();
        }
    }, function (response) {
        if(response.errcode == '114'){
            window.location.href = 'BaLogin.html';
            return;
        }
    });

    //设置充值提现汇率
    // $('.rechargeRateText').text(10);
    // $('.withdrawRateText').text(0.8);
    // $('.rechargeRateInput').bind('input porpertychange', function () {
    //     $('.rechargeShowRate').removeClass('none');
    //     $('.rechargeRateText').text($(this).val());
    // });
    // $('.withdrawRateInput').bind('input porpertychange', function () {
    //     $('.withdrawRateText').text($(this).val());
    // });

    //充值汇率设定
    $(".rechargeRateBtn").click(function () {
        var recharge_rate = $('.rechargeRateInput').val(),
            recharge_min_amount = $('.rechargeMinVal').val(),
            recharge_max_amount = $('.rechargeMaxVal').val(),
            limit_time = $('#rechargeRateTime').val(),
            recharge_us_level = $('.rechargeLevel').val(),
            pass_word_hash = hex_sha1($('#rechargePassword').val()),
            is_void = 0;
        var currentTime = CurrentTimeFun();
        console.log(recharge_rate);
        if(recharge_rate <= 0 || recharge_rate.length <= 0){
            LayerFun("pleaseEnterValidRate");
            return;
        }
        if(recharge_min_amount.length <= 0){
            LayerFun("pleaseEnterMin");
            return;
        }
        if(recharge_max_amount.length <= 0){
            LayerFun("pleaseEnterMax");
            return;
        }
        if($('#rechargePassword').val().length <= 0){
            LayerFun('passwordNotEmpty');
            return;
        }
        if(recharge_us_level.length<=0 || recharge_us_level<=0){
            LayerFun('pleaseEnterVailLevel');
            return;
        }
        if(Date.parse(limit_time)<=Date.parse(currentTime)){
            LayerFun("notLessCurrentTime");
            return;
        }
        var _this = $(this), btnText = $(this).text();
        if(DisableClick(_this)) return;
        rechargeRate(token, recharge_rate, recharge_min_amount, recharge_max_amount, limit_time, is_void, recharge_us_level,pass_word_hash, function (response) {
            if(response.errcode == '0'){
                ActiveClick(_this, btnText);
                $('.rechargeRateNotSet').hide();
                LayerFun('setSuccess');
                GetRechargeRateFun();
            }
        }, function (response) {
            ActiveClick(_this, btnText);
            if(response.errcode == '114'){
                window.location.href = 'BaLogin.html';
                return;
            }
            LayerFun('setFail');
            GetErrorCode(response.errcode);
            return;
        })
    });

    //获取充值汇率
    function GetRechargeRateFun(){
        GetRechargeRate(token, function (response){
            if(response.errcode == '0'){
                if(response.recharge_base_rate){
                    $('.rechargeShowRate').removeClass('none');
                }
                $('.recharge_rate').text(response.recharge_base_rate);
                $('.recharge_max_amount').text(response.recharge_max_amount);
                $('.recharge_min_amount').text(response.recharge_min_amount);
                $('.recharge_set_time').text(response.recharge_limit_time);
                if(!response.recharge_base_rate){
                    $('.rechargeNotSet').show();
                    $('.currentRechargeRateBox').hide();
                }else {
                    $('.rechargeNotSet').hide();
                    $('.currentRechargeRateBox').css('display', 'flex');
                }
            }
        }, function (response){
            if(response.errcode == '114'){
                window.location.href = 'BaLogin.html';
                return;
            }
            GetErrorCode(response.errcode);
            return;
        });
    }
    GetRechargeRateFun();

    //提现汇率设定
    $(".withdrawRateBtn").click(function () {
        var withdraw_rate = $('.withdrawRateInput').val(),
            withdraw_min_amount = $('.withdrawMinVal').val(),
            withdraw_max_amount = $('.withdrawMaxVal').val(),
            limit_time = $('#withdrawRateTime').val(),
            withdraw_us_level = $('.withdrawLevel').val(),
            pass_word_hash = hex_sha1($('#withdrawPassword').val()),
            is_void = 0;
        var currentTime = CurrentTimeFun();
        if(withdraw_rate <= 0 || withdraw_rate.length <= 0){
            LayerFun("pleaseEnterValidRate");
            return;
        }
        if(withdraw_min_amount.length <= 0){
            LayerFun("pleaseEnterMin");
            return;
        }
        if(withdraw_max_amount.length <= 0){
            LayerFun("pleaseEnterMax");
            return;
        }
        if($('#withdrawPassword').val().length <= 0){
            LayerFun('passwordNotEmpty');
            return;
        }
        if(withdraw_us_level.length<=0 || withdraw_us_level<=0){
            LayerFun('pleaseEnterVailLevel');
            return;
        }
        if(Date.parse(limit_time)<=Date.parse(currentTime)){
            LayerFun("notLessCurrentTime");
            return;
        }
        var _this = $(this), btnText = $(this).text();
        if(DisableClick(_this)) return;
        withdrawRate(token, withdraw_rate, withdraw_min_amount, withdraw_max_amount, limit_time, is_void, withdraw_us_level, pass_word_hash, function (response) {
            if(response.errcode == '0'){
                ActiveClick(_this, btnText);
                $('.withdrawRateNotSet').hide();
                LayerFun('setSuccess');
                GetWithdrawRateFun();
                return;
            }
        }, function (response) {
            ActiveClick(_this, btnText);
            if(response.errcode == '114'){
                window.location.href = 'BaLogin.html';
                return;
            }
            GetErrorCode(response.errcode);
            LayerFun('setFail');
            return;
        })
    });

    //获取提现汇率
    function GetWithdrawRateFun(){
        GetWithdrawRate(token, function (response){
            if(response.errcode == '0'){
                if(response.withdraw_base_rate){
                    $('.withdrawShowRate').removeClass('none');
                }
                $('.withdraw_max_amount').text(response.withdraw_max_amount);
                $('.withdraw_min_amount').text(response.withdraw_min_amount);
                $('.withdraw_set_time').text(response.withdraw_limit_time);
                if(!response.withdraw_base_rate){
                    $('.withdrawNotSet').show();
                    $('.currentWithdrawRateBox').hide();
                }else {
                    $('.withdrawNotSet').hide();
                    $('.currentWithdrawRateBox').css('display', 'flex');
                }
            }
        }, function (response){
            if(response.errcode == '114'){
                window.location.href = 'BaLogin.html';
                return;
            }
            GetErrorCode(response.errcode);
            return;
        });
    }
    GetWithdrawRateFun();

    //设置时间
    $('#withdrawRateTime,#rechargeRateTime').datetimepicker({
        initTime: new Date(),
        format: 'Y/m/d H:i',
        value: new Date(),
        minDate: new Date(),//设置最小日期
        minTime: new Date(),//设置最小时间
        yearStart: 2018,//设置最小年份
        yearEnd: 2050 //设置最大年份
    });
});