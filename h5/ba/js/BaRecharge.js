$(function () {
    //get token
    var token = GetUsCookie('user_token');
    var us_level = GetUsCookie('us_level');
    GetUsAccount();

    //get us_id
    var us_id = GetUsCookie('us_id');

    //Get parameters
    var bit_type = GetUsCookie('re_bit_type');

    $('.bit_type').text(bit_type);

    //choose ba
    var api_url = 'assign_recharge_ba.php', ba_id = '', bit_type = bit_type, base_rate='', min_amount='', max_amount='';
    GetBaItem(api_url, token, bit_type, function (response) {
        if (response.errcode == '0') {
            $('.base_rate').text(response.base_rate);
            ba_id = response.ba_id;
            base_rate = response.base_rate;
            min_amount = response.min_amount;
            max_amount = response.max_amount;
            $('.recharge_max_amount').text(max_amount);
            $('.recharge_min_amount').text(min_amount);
            $('.bit_amount').val(response.min_amount);
            if(base_rate <= 0){
                $('.base_amount').val(0);
            }else {
                $('.base_amount').val((response.min_amount) / base_rate);
            }
            if(response.set_time == "无限制"){
                $(".recharge_ctime").addClass("i18n").attr("name", "unlimited");
                execI18n();
            }else {
                $('.recharge_ctime').text(response.set_time);
            }
        }

    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //bind input
    $('.bit_amount').bind('input porpertychange', function () {
        if(base_rate <= 0){
            $('.base_amount').val(0);
        }else {
            $('.base_amount').val($('.bit_amount').val() / base_rate);
        }
    });
    $('.base_amount').bind('input porpertychange', function () {
        if(base_rate <= 0){
            $('.base_amount').val(0);
        }else {
            $('.bit_amount').val($(this).val() * base_rate);
        }
    });

    //lockRechargeAmount（Customer recharge request）
    $('.lockAmountBtn').click(function () {
        var base_amount = $('.base_amount').val(),
            bit_amount = $('.bit_amount').val();
        if(bit_amount < min_amount){
            LayerFun('notSmallAmount');
            return;
        }
        if(bit_amount > max_amount){
            LayerFun('notLagAmount');
            return;
        }
        //Lock judgment
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        LockAmount(token, ba_id, base_amount, bit_amount, bit_type, us_level, function (response){//lock
            if(response.errcode == '0'){
                ShowLoading("hide");
                ActiveClick($this, btnText);
                SetCookie('bit_address',response.bit_address);
                $('#lockRecharge').modal('show');
                readingTime(10);
            }
        }, function(response){
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
            return;
        });
    });
    $('.ruleBtn').click(function () {
        window.location.href = 'BaRechargeAddress.html?bit_type='+bit_type;
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
                $('.ruleBtn').attr('disabled', false);
                execI18n();
            }
        }, 1000);
    }
});