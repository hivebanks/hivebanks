$(function () {
    $('select').material_select();
    // var base_currency = GetCookie('base_currency');
    // $('.base_currency').text(base_currency);
    //获取user信息
    var limit = 10, offset = 0, n = 0;
    var us_id = GetQueryString('us_id'), tr = '';
    $('.us_id').text(us_id);
    GetUserInfo(us_id, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, bind_name = '', bind_type = '';
            if(data == false){GetDataEmpty('userBindInfo', '5')}
            $('.base_amount').text(data.base_amount);
            $('.lock_amount').text(data.lock_amount);
            $('.us_level').text(data.us_level);
            $('.security_level').text(data.security_level);
            $('.ctime').text(data.ctime);
            $.each(data, function (i, val) {
                if(typeof data[i] != 'object') return;

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
        GetErrorCode(response.errcode);
        GetDataEmpty('userBindInfo', '5');
        return;
        // tr += '<tr>' +
        //     '<td colspan="5"><span class="color-red">系统异常，请稍后再试</span></td>' +
        //     '</tr>';
        // $("#userBindInfo").html(tr);
        // console.log(response);
    });

    //设置时间
    $('#effectiveTime').datetimepicker({
        format: 'Y/m/d H:i',
        value: new Date(),
        minDate: new Date(),//设置最小日期
        minTime: new Date(),//设置最小时间
        yearStart: 2018,//设置最小年份
        yearEnd: 2050 //设置最大年份
    });

    //获取添加的黑名单列表
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
                        '<span class="margin-right-1 i18n" name="typeOfPunishment">处罚类型</span>:' +
                        '<span class="black_type i18n" name="'+ black_type +'"></span>' +
                        '</li>' +
                        '<li>' +
                        '<span class="margin-right-1 i18n" name="limitedTime">限制时间</span>:' +
                        '<span class="limit_time">' + data[i].limit_time + '</span>' +
                        '</li>' +
                        '<li>' +
                        '<span class="margin-right-1 i18n" name="ctime">创建时间</span>:' +
                        '<span class="ctime">' + data[i].ctime + '</span>' +
                        '</li>' +
                        '<li>' +
                        '<span class="margin-right-1 i18n" name="reasonForPunishment">处罚原因</span>:' +
                        '<span class="black_info">' + data[i].black_info + '</span>' +
                        '</li>' +
                        '</ul>'
                });
                $('#blackList').html(ul);
                execI18n();
            }
        }, function (response) {
            GetErrorCode(response.errcode);
        })
    }
    GetBlackListFun();

    //设置添加黑名单
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
        SetBlackList(us_id, type, black_info, limt_time, function (response) {
            if (response.errcode == '0') {
                layer.msg('<span class="i18n" name="setSuccessfully"></span>');
                execI18n();
                GetBlackListFun();
            }
        }, function (response) {
            layer.msg('<span class="i18n" name="setupFailed"></span>');
            execI18n();
            GetErrorCode(response.errcode);
        })
    });

    //设置时间
    $('#effectiveTime').datetimepicker({
        format: 'Y/m/d H:i',
        value: new Date(),
        minDate: new Date(),//设置最小日期
        minTime: new Date(),//设置最小时间
        yearStart: 2018,//设置最小年份
        yearEnd: 2050 //设置最大年份
    });
});