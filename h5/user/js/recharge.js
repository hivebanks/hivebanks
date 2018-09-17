$(function () {
    //get token
    var token = GetCookie('user_token');
    GetUsAccount();

    //get base_type
    var base_type = GetCookie('benchmark_type');

    // Switch between digital currency and legal tender
    $(".digital-btn").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".digital").fadeIn();
        $(".legal").fadeOut();
        $('.baRechargeCodeRow').fadeIn();
        $('.caRechargeCodeRow').fadeOut();
    });
    $(".legal-btn").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".digital").fadeOut();
        $(".legal").fadeIn();
        $('.baRechargeCodeRow').fadeOut();
        $('.caRechargeCodeRow').fadeIn();
    });
    //get ba recharge list
    var api_url = 'us_get_recharge_ba_list.php';
    GetBaRateList(api_url, token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, li = '';
            if (data == false) {
                $('.bitAgentTitle').attr('name', 'noDigitalCurrencyAgent');
                execI18n();
                return;
            }
            $.each(data, function (i, val) {
                li += '<li>' +
                    '<p>' +
                    '<svg class="icon" aria-hidden="true">' +
                    '<use xlink:href="#icon-' + data[i].bit_type.toUpperCase() + '"></use>' +
                    '</svg>' +
                    '</p>' +
                    '<span>' + data[i].bit_type + '</span>' +
                    '<div class="mask">' +
                    '<p class="parities">1' +
                    '<span class="base_type">' + base_type + '</span>=' +
                    '<span class="base_rate">' + data[i].base_rate + '</span>' +
                    '<span class="bit_type">' + data[i].bit_type + '</span>' +
                    '</p>' +
                    '</div>' +
                    '</li>';
            });
            $('#baRechargeList').html(li);
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //Click to select recharge
    $(document).on('click', '.digital-inner-box li', function () {
        var val = $(this).children("span").text().trim();
        SetCookie('re_bit_type', val);
        window.location.href = "../ba/BaRecharge.html";
    });

    //CA recharge to get the average exchange rate
    var recharge_rate = '', api_url = 'average_ca_recharge_rate.php';
    GetAverageRate(api_url, token, function (response) {
        if (response.errcode == '0') {
            if (response.recharge_rate == '0') {
                $('.currentRechargeRateBox, .legalRechargeBox').remove();
                $('.legalTitle').attr('name', 'noLegalCurrencyAgent');
                execI18n();
                return;
            }
            $('.recharge_rate').text(response.recharge_rate);
            recharge_rate = (response.recharge_rate);
            $('.bit_amount').val(response.recharge_rate);
        }
    }, function (response) {
        LayerFun(response.errcode);
    });

    //Enter the recharge amount binding input box
    $('.bit_amount').bind('input porpertychange', function () {
        $('.base_amount').val($(this).val() / recharge_rate);
        $('.payRechargeAmount').text($(this).val());
    });
    $('.base_amount').bind('input porpertychange', function () {
        $('.bit_amount').val($(this).val() * recharge_rate);
        $('.payRechargeAmount').text($('.bit_amount').val());
    });

    //Ca recharge the next step
    $('.enableAmount').click(function () {
        if ($('.bit_amount').val().length <= 0) {
            LayerFun('rechargeAmountNotEmpty');
            return
        }
        var base_amount = $('.base_amount').val();
        var us_recharge_bit_amount = $('.bit_amount').val();
        window.location.href = '../ca/CaRecharge.html?base_amount=' + base_amount + '&bit_amount=' + us_recharge_bit_amount;
    });

    // BA recharge recode
    var limit = 10, offset = 0,
        ba_api_url = 'log_ba_recharge.php';
    AllRecord(token, limit, offset, ba_api_url, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, tr = '';
            if (data == false) {
                GetDataEmpty('baRechargeCodeTable', '4');
                return;
            }
            $.each(data, function (i, val) {
                tr += '<tr>' +
                    '<td><span>' + data[i].tx_hash + '</span></td>' +
                    '<td><span>' + data[i].asset_id + '</span></td>' +
                    '<td><span>' + data[i].base_amount + '</span></td>' +
                    '<td><span>' + data[i].tx_time + '</span></td>' +
                    '</tr>'
            });
            $("#baRechargeCodeTable").html(tr);
        }
    }, function (response) {
        GetDataFail('baRechargeCodeTable', '4');
        if (response.errcode == '114') {
            window.location.href = 'login.html';
        }
    });

    // CA recharge recode
    var ca_api_url = 'log_ca_recharge.php',
        ca_tx_hash_arr = [];
    AllRecord(token, limit, offset, ca_api_url, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, tr = '';
            if (data == false) {
                GetDataEmpty('caRechargeCodeTable', '4');
                return;
            }
            $.each(data, function (i, val) {
                ca_tx_hash_arr.push(data[i].tx_hash.substr(0, 20) + '...');
                tr += '<tr>' +
                    '<td title=' + data[i].tx_hash + '>' + data[i].tx_hash + '</td>' +
                    '<td>' + data[i].lgl_amount + '</td>' +
                    '<td>' + data[i].base_amount + '</td>' +
                    '<td>' + data[i].tx_time + '</td></tr>';
            });
            $('#caRechargeCodeTable').html(tr);
        }
    }, function (response) {
        if (response.errcode == '114') {
            window.location.href = 'login.html';
        }
        GetDataEmpty('caRechargeCodeTable', '4');
    });
});
