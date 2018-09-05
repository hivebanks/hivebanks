$(function () {
    // token
    var token = GetCookie('user_token');

    // 用户基本信息
    var base_amount = '';
    UserInformation(token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows;
            var security_level = parseInt(data.security_level);
            SetCookie('us_id', data.us_id);
            SetCookie('us_level', data.us_level);
            SetCookie('us_account', data.us_account);
            base_amount = data.base_amount;
            $(".us_account").text(data.us_account);
            $('.ctime').text(data.ctime);
            $('.us_account').text(data.us_account);
            $('.availableBalance').text(data.base_amount);
            $('.lockBalance').text(data.lock_amount);
            $('.levelNum').text(security_level);
            // $('.userLevelNum').text(us_level);
        }
    }, function (response) {
        layer.msg(response.errcode);
        if (response.errcode == '114') {
            window.location.href = 'login.html';
        }
    });

    //提现
    $('.withdrawBtn, .navWithdraw').click(function () {
        if(base_amount <= 0){
            $('#noBalanceModal').modal('show');
            return;
        }
        window.location.href = "withdraw.html";
    });

    //修改昵称
    $('.modifyNameBtn').click(function () {
       var us_account = $('#nickName').val();
       if(us_account.length <= 0){
           LayerFun('pleaseEnterNickname');
           return;
       }
        $('#modifyName').modal('hide');
        ModifyNickName(token, us_account, function (response) {
            if(response.errcode == '0'){
                LayerFun('modifySuccess');
                $('.us_account').text(response.us_account);
                SetCookie('us_account', response.us_account);
                return;
            }
        }, function (response) {
            LayerFun('modifyFail');
            GetErrorCode(response.errcode);
            return;
        });
    });

    var limit = 10, offset = 0, n = 0, type = '2';
    //交易状态
    TradingStatus(token, limit, offset, type, function (response) {
        if(response.errcode == '0'){

        }
    }, function (response) {
        // GetErrorCode(response.errcode);
    });

    //账户变动记录
    var account_change_url = 'log_balance.php';

    function GetAccountChange(token, limit, offset, account_change_url) {
        var tr = '';
        AllRecord(token, limit, offset, account_change_url, function (response) {
            if (response.errcode == '0') {
                var pageCount = Math.ceil(response.total / limit);
                $('.totalPage').text(Math.ceil(response.total / limit));
                var data = response.rows;
                if(data.length <= 0){
                    $('.eg').hide();
                    return;
                }
                $.each(data, function (i, val) {
                    tr += '<tr>' +
                        '<td><span title="' + data[i].hash_id + '">' + data[i].hash_id.substr(0, 20) + '...' + '</span></td>' +
                        '<td><span class="i18n" name="' + data[i].tx_type + '">' + data[i].tx_type + '</span></td>' +
                        '<td><span>' + data[i].tx_amount + '</span></td>' +
                        '<td><span>' + data[i].credit_balance + '</span></td>' +
                        '<td><span>' + data[i].ctime + '</span></td>' +
                        '</tr>'
                });
                $('.accountChange').html(tr);
                execI18n();
                if(n == 0){
                    Page(pageCount);
                }
                n++;
            }
        }, function (response) {
            console.log(response);
        });
    };
    GetAccountChange(token, limit, offset, account_change_url);

    //    分页
    function Page(pageCount) {
        $('.account_log_code').pagination({
            pageCount: pageCount,
            callback: function (api) {
                offset = (api.getCurrent() - 1) * limit;
                $('.currentPage').text(api.getCurrent());
                GetAccountChange(token, limit, offset, account_change_url);
            }
        });
    }
});