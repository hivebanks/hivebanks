$(function () {
    //获取token
    var token = GetUsCookie('user_token');
    GetUsAccount();

    //获取us_level
    var us_level = GetUsCookie('us_level');

    // 获取基本信息
    var us_base_amount = '';
    GetUserBaseInfo(token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows;
            us_base_amount = data.base_amount;
            $('.base_amount').text(data.base_amount);
            if(data.base_amount <= 0){
                $('.allWithdraw').remove();
                $('.no_base_amount').show();
            }
        }
    }, function (response) {
        GetErrorCode(response.errcode);
        return;
    });

    //全部提现
    $('.allWithdraw').click(function () {
        $('.base_amount_input').val(us_base_amount);
        $('.bit_amount_input').val(us_base_amount * rate);
    });
    
    //获取充值渠道
    // var ca_channel = window.location.search.split('?')[1];
    var ca_channel = GetQueryString('ca_channel');
    var base_amount = GetQueryString('us_ca_withdraw_amount');
    $('.base_amount_input').val(base_amount);

    $('.withdrawTypeImg').attr("src", "img/" + ca_channel.toLowerCase() + ".png");

    //分配充值ca
    var api_url = 'assign_withdraw_ca.php', rate = '', ca_id = '', withdraw_max_amount = '', withdraw_min_amount = '';
    GetAssignCa(api_url, token, ca_channel, function (response) {
        if (response.errcode == '0') {
            $('.base_rate').text(response.base_rate);
            rate = response.base_rate;
            ca_id = response.ca_id;
            withdraw_max_amount = response.max_amount;
            withdraw_min_amount = response.max_amount;
            $('.withdraw_max_amount').text(response.max_amount);
            $('.withdraw_min_amount').text(response.min_amount);
            $('.withdraw_ctime').text(response.set_time);
            $('.bit_amount_input').val(base_amount * rate);
        }
    }, function (response) {
        GetErrorCode(response.errcode);
    });

    //获取us_account_id
    var option = '';
    GetUsAccountId(token, ca_channel, function (response){
        if(response.errcode == '0'){
            var data = response.rows;
            $.each(data, function (i, val) {
                option+='<option value ="'+ data[i].account_id +'">'+ data[i].lgl_address.lgl_address +'</option>';
            });
            $('.selectAddress').append(option);
            return;
        }
    }, function (response) {
        GetErrorCode(response.errcode);
        return;
    });

    //锁定充值金额
    $('.lockAmountBtn').click(function () {
        var bit_amount = $('.bit_amount_input').val(),
            base_amount = $('.base_amount_input').val(),
            us_account_id = $('.us_account_id').val();

        if (base_amount.length <= 0) {
            LayerFun('pleaseEnterWithdrawAmount');
            return;
        }
        if(base_amount < withdraw_min_amount){
            LayerFun('notSmallAmount');
            return;
        }
        if(base_amount > withdraw_max_amount){
            LayerFun('notLagAmount');
            return;
        }
        if(base_amount > us_base_amount){
            LayerFun('notBalance');
            return;
        }
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        LockWithdrawAmount(token, ca_id, base_amount, bit_amount, ca_channel, us_level, us_account_id, function (response) {
            if (response.errcode == '0') {
                ActiveClick($this, btnText);
                $('#lockWithdraw').modal('show');
                readingTime(8);
            }
        }, function (response) {
            ActiveClick($this, btnText);
            GetErrorCode(response.errcode);
            return;
        })
    });

    //确认阅读规则跳转
    $('.ruleBtn').click(function () {
        window.location.href = 'CaWithdrawInfo.html';
    });

    //输入框绑定
    $('.base_amount_input').bind('input', 'propertychange', function () {
        $('.bit_amount_input').val($(this).val() * rate);
    });
    $('.bit_amount_input').bind('input', 'propertychange', function () {
        $('.base_amount_input').val($(this).val() / rate);
    });

    //阅读规则时间倒计时
    function readingTime(time) {
        var timer = null;
        timer = setInterval(function () {
            if (time != 0) {
                time--;
                // $('.ruleBtn').text(time + 's').attr('disabled', true);
            } else {
                clearInterval(timer);
                $('.ruleBtn').attr('disabled', false);
                execI18n();
            }
        }, 1000);
    }
});