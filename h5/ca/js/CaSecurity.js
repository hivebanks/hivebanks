$(function () {
    // get ca bind information
    var token = GetCookie('ca_token'), cellphone = '';
    GetCaAccount();
    GetCaBindInformation(token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows,
                security_level = parseInt(response.security_level.security_level);
            $('.leave .progress-bar').css('width', security_level * 10 + '%');
            $('.levelNum').text(security_level);

            // Security Level
            $.each(data, function (i, val) {
                //Whether the phone is bound
                if (data[i].bind_name == 'cellphone' && data[i].bind_flag == '1') {
                    cellphone = 'cellphone';
                    $('.phoneTime').removeClass('i18n').text($(this)[0].ctime).addClass('isTime');
                    $('.phoneBind').fadeOut('fast');
                    $('.phoneModify').fadeIn('fast');
                    $(".phoneInfo").text($(this)[0].bind_info);
                    $('.phoneIcon').addClass('greenIcon icon-duihao').removeClass('symbol icon-gantanhao');
                }

                //Whether the email is bound
                if (data[i].bind_name == 'email' && data[i].bind_flag == '1') {
                    $('.emailTime').removeClass('i18n').text($(this)[0].ctime).addClass('isTime');
                    $('.emailBind').fadeOut('fast');
                    $('.emailModify').fadeIn('fast');
                    $(".emailInfo").text($(this)[0].bind_info);
                    $('.emailIcon').addClass('greenIcon icon-duihao').removeClass('symbol icon-gantanhao');
                }

                //Whether google is certified
                if (data[i].bind_name == 'GoogleAuthenticator' && data[i].bind_flag == '1') {
                    $('.googleTime').removeClass('i18n').text($(this)[0].ctime).addClass('isTime');
                    $('.googleBind').fadeOut('fast');
                    // $('.fileModify').fadeIn('fast');
                    $('.googleIcon').addClass('greenIcon icon-duihao').removeClass('symbol icon-gantanhao');
                }

                //Whether the password hash is bound
                if (data[i].bind_name == 'pass_hash' && data[i].bind_flag == '1') {
                    $('.fundPasswordTime').removeClass('i18n').text($(this)[0].ctime).addClass('isTime');
                    $('.fundPasswordBind').fadeOut('fast');
                    $('.fundPasswordModify').fadeIn('fast');
                    $('.fundPasswordIcon').addClass('greenIcon icon-duihao').removeClass('symbol icon-gantanhao');
                }

                //Whether identity authentication is bound
                if (data[i].bind_name == 'idPhoto' && data[i].bind_flag == '1') {
                    $('.authenticationTime').removeClass('i18n').text($(this)[0].ctime).addClass('isTime');
                    $('.authenticationBind').fadeOut('fast');
                    // $('.authenticationModify').fadeIn('fast');
                    $('.authenticationIcon').addClass('greenIcon icon-duihao').removeClass('symbol icon-gantanhao');
                }
            })
        }
    }, function (response) {
        LayerFun(response.errcode);
        if (response.errcode == '114') {
            window.location.href = 'CaLogin.html';
        }
        return;
    });

    //Fund password binding
    $('.fundPasswordBind').click(function () {
        if (cellphone != 'cellphone') {
            $('#goBindCellPhone').modal('show');
            return;
        } else {
            window.location.href = 'CaFundPasswordBind.html';
        }
    });
    $('.fundPasswordModify').click(function () {
        if (cellphone != 'cellphone') {
            $('#goBindCellPhone').modal('show');
            return;
        } else {
            window.location.href = 'CaFundPasswordModify.html';
        }
    });

    // Login record query
    var login_api_url = 'log_login.php', limit = 10, offset = 0, n = 0;

    function GetLoginCode(token, limit, offset, login_api_url) {
        var tr = '', pageCount = '';
        AllRecord(token, limit, offset, login_api_url, function (response) {
            if (response.errcode == '0') {
                var data = response.rows;
                if (data.length <= 0) {
                    $('.eg').hide();
                }
                pageCount = Math.ceil(response.total / limit);
                $('.totalPage').text(pageCount);
                for (var i = 0; i < data.length; i++) {
                    tr += '<tr>' +
                        '<td class="i18n" name="' + data[i].lgn_type + '">' + data[i].lgn_type.substr(0, 20) + '...' + '</td>' +
                        '<td>' + data[i].ctime + '</td>' +
                        '<td>' + data[i].ca_ip + '</td>' +
                        '<td>' + data[i].ip_area + '</td>' +
                        '</tr>';
                }

                $('#loginCode').html(tr);
                execI18n();
                if (n == 0) {
                    Page(pageCount);
                }
                n++;
            }

        }, function (response) {
            execI18n();
            LayerFun(response.errcode);
            if (response.errcode == '114') {
                window.location.href = 'CaLogin.html';
            }
        });
    };
    GetLoginCode(token, limit, offset, login_api_url);

//    Pagination
    function Page(pageCount) {
        $('.login_log_code').pagination({
            pageCount: pageCount,
            callback: function (api) {
                offset = (api.getCurrent() - 1) * limit;
                $('.currentPage').text(api.getCurrent());
                GetLoginCode(token, limit, offset, login_api_url);
            }
        });
    }
});

