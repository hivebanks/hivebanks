$(function () {
    $('select').material_select();
    //get user info
    var limit = 10, offset = 0, n = 0;
    var us_id = GetQueryString('us_id'), tr = '';
    $('.us_id').text(us_id);
    GetUserInfo(us_id, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, bind_name = '', bind_type = '';
            if (data == false) {
                GetDataEmpty('userBindInfo', '5')
            }
            $('.base_amount').text(data.base_amount);
            $('.lock_amount').text(data.lock_amount);
            $('.us_level').text(data.us_level);
            $('.security_level').text(data.security_level);
            $('.ctime').text(data.ctime);
            $.each(data, function (i, val) {
                if (typeof data[i] != 'object') return;

                //bind_type
                if (data[i].bind_type == 'hash') {
                    bind_type = 'hashBind';
                }
                if (data[i].bind_type == 'text') {
                    bind_type = 'textBind';
                }
                if (data[i].bind_type == 'file') {
                    bind_type = 'fileBind';
                }

                //bind_name
                if (data[i].bind_name == 'password_login') {
                    bind_name = 'password_login';
                }
                if (data[i].bind_name == 'email') {
                    bind_name = 'email';
                }
                if (data[i].bind_name == 'cellphone') {
                    bind_name = 'cellphone';
                }
                if (data[i].bind_name == 'googleAuthenticator') {
                    bind_name = 'googleAuthenticator';
                }
                if (data[i].bind_name == 'idNum') {
                    bind_name = 'idNum';
                }
                if (data[i].bind_name == 'name') {
                    bind_name = 'name';
                }

                tr += '<tr>' +
                    '<td><span>' + data[i].bind_id + '</span></td>' +
                    '<td><span class="i18n" name="' + bind_name + '">' + data[i].bind_name + '</span></td>' +
                    '<td><span class="i18n" name="' + bind_type + '">' + data[i].bind_type + '</span></td>' +
                    '<td><span class="i18n" name="bindingSuccess">' + data[i].bind_flag + '</span></td>' +
                    '<td><span>' + data[i].ctime + '</span></td>' +
                    '</tr>'
            });
            $("#userBindInfo").html(tr);
        }
    }, function (response) {
        LayerFun(response.errcode);
        GetDataEmpty('userBindInfo', '5');
        return;
    });

    //Set time
    $('#effectiveTime').datetimepicker({
        format: 'Y/m/d H:i',
        value: new Date(),
        minDate: new Date(),//Set minimum date
        minTime: new Date(),//Set minimum time
        yearStart: 2018,//Set the minimum year
        yearEnd: 2050 //Set the maximum year
    });

    //Get the list of added blacklists
    function GetBlackListFun() {
        var ul = '';
        GetBlackList(us_id, function (response) {
            if (response.errcode == '0') {
                var data = response.rows;
                if (data.length <= 0) {
                    ul += '<ul class="padding-1">' +
                        '<li><span class="i18n" name="noData">no Data</span></li>' +
                        '</ul>';
                    $('#blackList').html(ul);
                    execI18n();
                    return;
                }
                var black_type = '';
                $.each(data, function (i, val) {
                    if (data[i].black_type == '1') {
                        black_type = 'loginIsProhibited';
                    }

                    if (data[i].black_type == '2') {
                        black_type = 'withdrawIsProhibited';
                    }

                    if (data[i].black_type == '3') {
                        black_type = 'rechargeIsProhibited';
                    }

                    ul += '<ul class="padding-1" style="background: #eeeeee">' +
                        '<li>' +
                        '<span class="margin-right-1 i18n" name="typeOfPunishment"></span>:' +
                        '<span class="black_type i18n" name="' + black_type + '"></span>' +
                        '</li>' +
                        '<li>' +
                        '<span class="margin-right-1 i18n" name="limitedTime"></span>:' +
                        '<span class="limit_time">' + data[i].limit_time + '</span>' +
                        '</li>' +
                        '<li>' +
                        '<span class="margin-right-1 i18n" name="ctime"></span>:' +
                        '<span class="ctime">' + data[i].ctime + '</span>' +
                        '</li>' +
                        '<li>' +
                        '<span class="margin-right-1 i18n" name="reasonForPunishment"></span>:' +
                        '<span class="black_info">' + data[i].black_info + '</span>' +
                        '</li>' +
                        '</ul>'
                });
                $('#blackList').html(ul);
                execI18n();
            }
        }, function (response) {
            LayerFun(response.errcode);
        })
    }

    GetBlackListFun();

    //Set add blacklist
    $('.blacklistBtn').click(function () {
        var limt_time = $('.limt_time').val(),
            black_info = $('.black_info').val(),
            type = $('.blacklist').val();

        if (type == null) {
            layer.msg('<span class="i18n" name="pleaseBlacklisted"></span>');
            execI18n();
            return;
        }
        if (black_info.length <= 0) {
            layer.msg('<span class="i18n" name="pleaseEnterPenalty"></span>');
            execI18n();
            return;
        }
        $(".preloader-wrapper").addClass("active");
        SetBlackList(us_id, type, black_info, limt_time, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                layer.msg('<span class="i18n" name="setSuccessfully"></span>');
                execI18n();
                GetBlackListFun();
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            layer.msg('<span class="i18n" name="setupFailed"></span>');
            execI18n();
            LayerFun(response.errcode);
        })
    });

    //Set time
    $('#effectiveTime').datetimepicker({
        format: 'Y/m/d H:i',
        value: new Date(),
        minDate: new Date(),//Set minimum date
        minTime: new Date(),//Set minimum time
        yearStart: 2018,//Set the minimum year
        yearEnd: 2050 //Set the maximum year
    });
});