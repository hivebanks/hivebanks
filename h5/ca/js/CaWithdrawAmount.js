$(function () {
    //get token
    var token = GetUsCookie('user_token');
    GetUsAccount();

    //get us_level
    var us_level = GetUsCookie('us_level');

    // get base information
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
        LayerFun(response.errcode);
        return;
    });

    //fullWithdrawal
    $('.allWithdraw').click(function () {
        $('.base_amount_input').val(us_base_amount);
        $('.bit_amount_input').val(us_base_amount * rate);
    });
    
    //Get recharge channels
    var ca_channel = GetQueryString('ca_channel');
    var base_amount = GetQueryString('us_ca_withdraw_amount');
    $('.base_amount_input').val(base_amount);

    $('.withdrawTypeImg').attr("src", "img/" + ca_channel.toLowerCase() + ".png");

    //Assign recharge ca
    var api_url = 'assign_withdraw_ca.php', rate = '', ca_id = '', withdraw_max_amount = '', withdraw_min_amount = '';
    GetAssignCa(api_url, token, ca_channel, function (response) {
        if (response.errcode == '0') {
            $('.base_rate').text(response.base_rate);
            rate = response.base_rate;
            ca_id = response.ca_id;
            withdraw_max_amount = response.max_amount;
            withdraw_min_amount = response.min_amount;
            $('.withdraw_max_amount').text(response.max_amount);
            $('.withdraw_min_amount').text(response.min_amount);
            $('.withdraw_ctime').text(response.set_time);
            $('.bit_amount_input').val(base_amount * rate);
        }
    }, function (response) {
        LayerFun(response.errcode);
    });

    //get us_account_id
    var option = '';
    GetUsAccountId(token, ca_channel, function (response){
        if(response.errcode == '0'){
            var data = response.rows;
            if(data == false){

            }
            $.each(data, function (i, val) {
                option+='<option value ="'+ data[i].account_id +'">'+ data[i].lgl_address.lgl_address +'</option>';
            });
            $('.selectAddress').append(option);
            return;
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //lockRechargeAmount
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
            LayerFun(response.errcode);
            return;
        })
    });

    //Confirm reading rule jump
    $('.ruleBtn').click(function () {
        window.location.href = 'CaWithdrawInfo.html';
    });

    //Input box listener
    $('.base_amount_input').bind('input', 'propertychange', function () {
        $('.bit_amount_input').val($(this).val() * rate);
    });
    $('.bit_amount_input').bind('input', 'propertychange', function () {
        $('.base_amount_input').val($(this).val() / rate);
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