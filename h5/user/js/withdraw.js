$(function () {
    //获取token;
    var token = GetCookie('user_token');
    GetUsAccount();

    //获取base_type
    var base_type = GetCookie('benchmark_type');

    // 点击切换数字货币和法定货币
    $('.digital-btn').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('.digital').fadeIn();
        $('.legal').fadeOut();
        $('.baWithdrawCodeRow').fadeIn();
        $('.caWithdrawCodeRow').fadeOut();
    });
    $('.legal-btn').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('.digital').fadeOut();
        $('.legal').fadeIn();
        $('.baWithdrawCodeRow').fadeOut();
        $('.caWithdrawCodeRow').fadeIn();
    });

    //获取ba提现列表
    var api_url = 'us_get_withdraw_ba_list.php';
    GetBaRateList(api_url, token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, li = '';

            if(data == false){
                $('.bitAgentTitle').attr('name', 'noDigitalCurrencyAgent');
                execI18n();
                return;
            }

            $.each(data, function (i, val) {
                li+='<li>' +
                    '<p><i class="iconfont icon-'+ data[i].bit_type.toUpperCase() +'"></i></p>'+
                    '<span>'+ data[i].bit_type +'</span>' +
                    '<div class="mask">' +
                    '<p class="parities">1' +
                    '<span class="bit_type">'+ data[i].bit_type +'</span>=' +
                    '<span class="base_rate">'+ data[i].base_rate +'</span>' +
                    '<span class="base_type">'+ base_type +'</span>' +
                    '</p>' +
                    '</div>'+
                    '</li>'
            });
            $('#baWithdrawList').html(li);
        }
    }, function (response) {
        GetErrorCode(response.errcode);
        return;
    });

    //获取用户绑定信息
    var us_bind_type_name = '', us_bind_type_idNum = '', us_bind_type_file = '', us_bind_name_idPhoto = '';
    BindingInformation(token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows;
            $.each(data, function (i, val) {
                if (data[i].bind_type == 'file' && data[i].bind_name == 'idPhoto') {
                    us_bind_type_file = 'file';
                    us_bind_name_idPhoto = 'idPhoto';
                }
                if(data[i].bind_name = 'name'){us_bind_type_name = 'name'}
                if(data[i].bind_name = 'idNum'){us_bind_type_idNum = 'idNum'}
            });
        }
    }, function (response) {
        GetErrorCode(response.errcode);
    });

    //点击选择提现
    $(document).on('click', '.digital-inner-box li', function () {
        if (us_bind_type_name != 'name' || us_bind_type_idNum !='idNum' || us_bind_name_idPhoto != 'idPhoto') {
            $('#notAuthentication').modal('show');
            return;
        } else {
            var val = $(this).children("span").text().trim();
            SetCookie('wi_bit_type', val);
            window.location.href = "../ba/BaWithdraw.html";
        }
    });


    //获取Ca提现平均汇率
    var withdraw_rate = '', api_url = 'average_ca_withdraw_rate.php';
    GetAverageRate(api_url, token, function (response){
        if(response.errcode == '0'){
            $('.withdraw_rate').text(response.withdraw_rate);
            withdraw_rate = (response.withdraw_rate);
            $('.bit_amount').val(response.withdraw_rate);
        }
    }, function (response){
        GetErrorCode(response.errcode);
    });

    //获取用户账户余额显示
    var us_base_amount = '';
    UserInformation(token, function (response) {
        if (response.errcode == '0') {
            us_base_amount = response.rows.base_amount;
            $('.us_base_amount').text(response.rows.base_amount);
            if(response.rows.base_amount <= 0){
                $('.insufficientBalance').show().siblings('span').remove();
            }else {
                $('.fullWithdrawal').show().siblings('span').remove();
            }
        }
    }, function (response) {
        GetErrorCode(response.errcode);
        if (response.errcode == '114') {
            window.location.href = 'login.html';
        }
    });

    //输入充值金额绑定输入框
    $('.base_amount').bind('input porpertychange', function () {
        $('.bit_amount').val($(this).val() * withdraw_rate);
        $('.payWithdrawAmount').text($(this).val());
    });
    $('.bit_amount').bind('input porpertychange', function () {
        $('.base_amount').val($(this).val() / withdraw_rate);
        $('.payWithdrawAmount').text($('.base_amount').val());
    });

    //全部提现
    $('.fullWithdrawal').click(function () {
        $('.base_amount').val(us_base_amount);
        $('.bit_amount').val(us_base_amount * withdraw_rate);
    });
    
    //ca充值下一步操作
    $('.enableAmount').click(function (){
        if (us_bind_type_name != 'name' || us_bind_type_idNum !='idNum' || us_bind_name_idPhoto != 'idPhoto') {
            $('#notAuthentication').modal('show');
            return;
        }

        if($('.base_amount').val().length <= 0){
            LayerFun('withdrawalAmountNotEmpty');
        }

        if(us_base_amount <= 0){
            LayerFun('insufficientBalance');
            return;
        }
        var base_amount = $('.base_amount').val();
        if(base_amount > us_base_amount){
            LayerFun('insufficientBalance');
            return;
        }

        if(base_amount <= 0){
            LayerFun('pleaseEnterCorrectWithdrawAmount');
            return;
        }
        window.location.href = '../ca/CaWithdraw.html?us_ca_withdraw_amount=' + base_amount;
    });
    // BA提现记录
    var limit = 0, offset = 5,
        ba_api_url = 'log_ba_withdraw.php',
        tr = '', ba_tx_hash_arr = [];
    AllRecord(token, limit, offset, ba_api_url, function (response) {
        if (response.errcode == '0') {
            var data = response.rows;
            if(data == false){
                GetDataEmpty('baWithdrawCodesTable', '4');
                return;
            }
            $.each(data, function (i, val) {
                tr+='<tr>' +
                    '<td>'+ data[i].transfer_tx_hash +'</td>' +
                    '<td>'+ data[i].asset_id +'</td>' +
                    '<td>'+ data[i].base_amount +'</td>' +
                    '<td>'+ data[i].tx_time +'</td>' +
                    '</tr>'
            });
        }
    }, function (response) {
        GetDataFail('baWithdrawCodesTable', '4');
        if (response.errcode == '114') {
            window.location.href = 'login.html';
        }
    });
    // CA提现记录
    var ca_api_url = 'log_ca_withdraw.php', ca_tr = '';
    AllRecord(token, limit, offset, ca_api_url, function (response) {
        if (response.errcode == '0') {
            var data = response.rows;
            if(data == false){
                GetDataEmpty('caWithdrawCodesTable', '4');
                return;
            }
            $.each(data,function (i,val){
                ca_tr += '<tr>'+
                    '<td title='+ data[i].tx_hash +'>'+ data[i].tx_hash +'</td>'+
                    '<td>'+data[i].lgl_amount+'</td>'+
                    '<td>'+data[i].base_amount+'</td>'+
                    '<td>'+data[i].tx_time+'</td></tr>';
            });
            $('.caWithdrawCodesTable').html(ca_tr);
        }
    }, function (response) {
        GetDataFail('caWithdrawCodesTable', '4');
        if (response.errcode == '114') {
            window.location.href = 'login.html';
        }
    })
});
