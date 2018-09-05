$(function(){
    //获取CA的token
    var token = GetCookie('ca_token');

    //获取CA基本信息
    GetCaInformation(token, function (response){
        if(response.errcode == '0'){
            // $('.ca_id').text(response.ca_id);
            $('.base_amount').text(response.base_amount);
            $('.ca_account').text(response.ca_account);
            $('.lock_amount').text(response.lock_amount);
            $('.security_level').text(response.security_level);
            $('.count_recharge').text(response.count_recharge);
            $('.count_withdraw').text(response.count_withdraw);
            SetCookie('ca_account', response.ca_account);
        }
    }, function (response){
        GetErrorCode(response.errcode);
    });

    //修改昵称
    $('.modifyNameBtn').click(function () {
        var ca_account = $('#nickName').val();
        if(ca_account.length <= 0){
            LayerFun('pleaseEnterNickname');
            return;
        }
        $('#modifyName').modal('hide');
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        ModifyNickName(token, ca_account, function (response) {
            if(response.errcode == '0'){
                ActiveClick($this, btnText);
                LayerFun('modifySuccess');
                $('.ca_account').text(response.ca_account);
                return;
            }
        }, function (response) {
            ActiveClick($this, btnText);
            GetErrorCode(response.errcode);
            return;
        })
    });

    //获取绑定信息
    var cellphone = '', funPass = '';
    GetCaBindInformation(token, function (response) {
        if(response.errcode == '0'){
            var data = response.rows;
            $.each(data, function (i, val) {
                if(data[i].bind_name == 'pass_hash' &&  data[i].bind_flag == '1'){
                    funPass = data[i].bind_name;
                }
                if(data[i].bind_name == 'cellphone' &&  data[i].bind_flag == '1'){
                    cellphone = data[i].bind_name;
                }
            })
        }
    }, function (response) {
        GetErrorCode(response.errcode);
        return;
    });
    //提现保证金
    $('.withdraw_amount').click(function () {
        // if(cellphone != 'cellphone'){
        //     $('#phoneBind').modal('show');
        //     return;
        // }
        if(funPass != 'pass_hash'){
            $('#goBindFundPass').modal('show');
            return;
        }

        window.location.href = 'CaWithdrawMargin.html';

    });

    //账户变动记录
    var limit = 10, offset = 0, n = 0;
    var api_url = 'log_balance.php';

    function GetAccountChange(token, limit, offset, api_url) {
        var tr = '';
        AllRecord(token, limit, offset, api_url, function (response) {
            if (response.errcode == '0') {
                var pageCount = Math.ceil(response.rows.length / limit);
                $('.totalPage').text(Math.ceil(response.rows.length / limit));
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
            }
        }, function (response) {
            GetErrorCode(response.errcode);
            return;
        });
    };
    GetAccountChange(token, limit, offset, api_url);

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