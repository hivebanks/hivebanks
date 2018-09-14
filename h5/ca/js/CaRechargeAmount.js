$(function () {
    //get token
    var token = GetUsCookie('user_token');
    GetUsAccount();

    //get us_level
    var us_level = GetUsCookie('us_level');

    //get recharge assets
    var ca_channel = GetQueryString('ca_channel');
    var us_recharge_bit_amount = GetQueryString('us_recharge_bit_amount');
    $('.bit_amount').val(us_recharge_bit_amount);

    // $('.rechargeType').text(ca_channel);
    $('.rechargeTypeImg').attr("src", "img/" + ca_channel.toLowerCase() + ".png");

    //distribution recharge ca
    var api_url = 'assign_recharge_ca.php', rate = '', ca_id = '', recharge_max_amount = '', recharge_min_amount = '';
    GetAssignCa(api_url, token, ca_channel, function (response) {
        if (response.errcode == '0') {
            $('.base_rate').text(response.base_rate);
            rate = response.base_rate;
            ca_id = response.ca_id;
            recharge_max_amount = response.recharge_max_amount;
            recharge_min_amount = response.recharge_min_amount;
            $('.recharge_max_amount').text(response.max_amount);
            $('.recharge_min_amount').text(response.min_amount);
            $('.recharge_ctime').text(response.set_time);
            $('.base_amount').val(us_recharge_bit_amount / rate);
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //lockRechargeAmount
    var card_nm = '', name = '', bit_amount = '', base_amount = '';
    $('.lockAmountBtn').click(function () {
            bit_amount = $('.bit_amount').val();
            base_amount = $('.base_amount').val();
        if (bit_amount.length <= 0) {
            LayerFun('pleaseEnterRechargeAmount');
            return;
        }
        if (bit_amount < recharge_min_amount) {
            LayerFun('notSmallAmount');
            return;
        }
        if (bit_amount > recharge_max_amount) {
            LayerFun('notLagAmount');
            return;
        }

        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        ShowLoading("show");
        LockRechargeAmount(token, ca_id, base_amount, bit_amount, ca_channel, us_level, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                $('#lockRecharge').modal('show');
                readingTime(10);
                card_nm = response.lgl_address.card_nm;
                name = response.lgl_address.name;
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
            return;
        })
    });

    //Confirm reading rule jump
    $('.ruleBtn').click(function () {
        window.location.href = 'CaRechargeAddress.html?ca_channel=' + ca_channel + '&name=' + name + '&card_nm=' + card_nm + '&bit_amount=' + bit_amount + '&base_amount=' + base_amount;
    });

    //input
    $('.bit_amount_input').bind('input', 'propertychange', function () {
        $('.base_amount_input').val($('.bit_amount_input').val() / rate);
    });
    $('.base_amount_input').bind('input', 'propertychange', function () {
        $('.bit_amount_input').val($('.base_amount_input').val() * rate);
    });

    //Reading rule time countdown
    function readingTime(time) {
        var timer = null;
        timer = setInterval(function () {
            if (time != 0) {
                time--;
                $('.ruleBtn').text(time + 's').css("color", "#ffffff");
            } else {
                clearInterval(timer);
                $('.ruleBtn').attr('disabled', false).css("color", "unset");
                execI18n();
            }
        }, 1000);
    }
});