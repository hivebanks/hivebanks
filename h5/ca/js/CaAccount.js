$(function(){
    //get ca token
    var token = GetCookie('ca_token');

    //get ca base information
    GetCaInformation(token, function (response){
        if(response.errcode == '0'){
            $('.base_amount').text(response.base_amount);
            $('.ca_account').text(response.ca_account);
            $('.lock_amount').text(response.lock_amount);
            $('.count_recharge').text(response.count_recharge);
            $('.count_withdraw').text(response.count_withdraw);
            if(response.security_level == null){
                $('.security_level').text("0");
            }else {
                $('.security_level').text(response.security_level);
            }
            SetCookie('ca_account', response.ca_account);
            SetCookie('ca_id', response.ca_id);
        }
    }, function (response){
        LayerFun(response.errcode);
        if(response.errcode == "114"){
            window.location.href = "CaLogin.html";
        }
    });
    $(".loadingbtn").click(function () {
        ShowLoading("show");
    });
    $(".loadingbtn2").click(function () {
        ShowLoading("hide");
    });
    //change username
    $('.modifyNameBtn').click(function () {
        var ca_account = $('#nickName').val();
        if(ca_account.length <= 0){
            LayerFun('pleaseEnterNickname');
            return;
        }
        $('#modifyName').modal('hide');
        ShowLoading("show");
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        ModifyNickName(token, ca_account, function (response) {
            if(response.errcode == '0'){
                ShowLoading("hide");
                ActiveClick($this, btnText);
                LayerFun('modifySuccess');
                $('.ca_account').text(response.ca_account);
                return;
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
            return;
        })
    });

    //Get binding information
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
        LayerFun(response.errcode);
        return;
    });

    //add margin withdraw address or withdraw margin
    $('.withdraw_amount, .addMarginWithdrawAddress').click(function () {
        if(funPass != 'pass_hash'){
            $('#goBindFundPass').modal('show');
            return;
        }
        window.location.href = 'BaMarginWithdrawAddress.html';
    });

    //Account change record
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
            LayerFun(response.errcode);
            return;
        });
    };
    GetAccountChange(token, limit, offset, api_url);

    //    Pagination
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