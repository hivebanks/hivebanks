$(function () {
    //获取token
    var token = GetCookie('la_token');

    // var base_currency = GetCookie('base_currency');
    // $('.base_currency').text(base_currency);

    //获取ba信息
    var limit = 10, offset = 0, n = 0;
    var ca_id = GetQueryString('ca_id'), tr = '';

    $('.ca_id').text(ca_id);
    GetCaInfo(ca_id, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, bind_type = '', bind_name = '';
            $('.base_amount').text(data.base_amount);
            $('.lock_amount').text(data.lock_amount);
            $('.ca_level').text(data.ca_level);
            $('.security_level').text(data.security_level);
            $('.ctime').text(data.ctime);
            if(data == false){
                GetDataEmpty('caBindInfo', '5');
                return;
            }
            $.each(data, function (i, val) {
                if (typeof data[i] != 'object') return;
                //bind_type
                if(data[i].bind_type == 'hash'){bind_type = 'hashBind';}
                if(data[i].bind_type == 'text'){bind_type = 'textBind';}
                if(data[i].bind_type == 'file'){bind_type = 'fileBind';}

                //bind_name
                if(data[i].bind_name == 'password_login'){bind_name='password_login';}
                if(data[i].bind_name == 'email'){bind_name='email';}
                if(data[i].bind_name == 'cellphone'){bind_name='cellphone';}
                if(data[i].bind_name == 'googleAuthenticator'){bind_name='googleAuthenticator';}
                if(data[i].bind_name == 'idNum'){bind_name='idNum';}
                if(data[i].bind_name == 'name'){bind_name='name';}

                tr += '<tr>' +
                    '<td><span>' + data[i].bind_id + '</span></td>' +
                    '<td><span class="i18n" name="'+ bind_name +'">' + data[i].bind_name + '</span></td>' +
                    '<td><span class="i18n" name="'+ bind_type +'">' + data[i].bind_type + '</span></td>' +
                    '<td><span class="i18n" name="bindingSuccess">' + data[i].bind_flag + '</span></td>' +
                    '<td><span>' + data[i].ctime + '</span></td>' +
                    '</tr>'
            });
            $("#caBindInfo").html(tr);
        }
    }, function (response) {
        if (response.errcode == '-1') {
            GetErrorCode(response.errcode);
            GetDataFail('caBindInfo', '5');
            return;
        }
    });
    // $('select').material_select();
    //调整保证金
    $('.edit').click(function () {
        $('.reviseAmount').show();
    });

    //确认调整保证金
    $('.reviseAmountBtn').click(function () {
        var base_amount = $('#reviseAmount').val(), pass_word_hash = hex_sha1($('#password').val());
        if(base_amount.length <= 0){
            LayerFun('pleaseEnterADeposit');
            return;
        }
        if($('#password').val().length <= 0){
            LayerFun('pleaseEnterYourPassword');
            return;
        }
        ReviseCaAmount(token, ca_id, base_amount, pass_word_hash, function (response) {
            if(response.errcode == '0'){
                var data = response.rows;
                $('.base_amount').text(data.base_amount);
                $('.reviseAmount').hide();
                LayerFun('setSuccessfully');
                return;
            }
        }, function (response) {
            GetErrorCode(response.errcode);
            LayerFun('setupFailed');
            return;
        })
    });

    //取消调整保证金
    $('.cancelReviseAmountBtn').click(function () {
        $('.reviseAmount').hide();
    });
});