$(function () {
    //获取token
    var token = GetCookie('user_token');
    GetUsAccount();

    //获取图形验证码
    GetImgCode();

    //获取手机验证码
    $('.phoneCodeBtn').click(function () {
        var bind_type = '4', $this = $(this), cfm_code = $('#phoneCfmCode').val();
        if(cfm_code <= 0){
            LayerFun('pleaseImgCode');
            return;
        }
        GetPhoneCodeFun(bind_type, $this, cfm_code);
    });

    //获取url参数
    var wi_funPass = GetQueryString('wi_funPass');

    //获取绑定信息
    BindingInformation(token, function (response) {
        if(response.errcode == '0'){
            var data = response.rows;
            $.each(data, function (i, val) {
                if(data[i].bind_name != 'pass_hash' &&  data[i].bind_flag == '1'){
                    $("#goBindCellPhone").modal('show');
                    return;
                }
            })
        }
    }, function (response) {
        GetErrorCode(response.errcode);
        return;
    });

    //绑定资金密码
    $('.fundPasswordEnable').click(function () {
        var hash_type = 'pass_hash',
            // 获取国家代码
            country_code = $('.selected-dial-code').text().split("+")[1],
            phone = country_code + '-' + $('#phone').val(),
            phoneCode = $('#phoneCode').val(),
            hash = hex_sha1($('#fundPassword').val()),
            password = $('#password').val(),
            pass_word_hash = hex_sha1(password);
        if ($('#fundPassword').val() == '') {
            LayerFun('funPassNotEmpty');
            return;
        }

        if ($('#phone').val() == '') {
            LayerFun('phoneNotEmpty');
            return;
        }

        if ($('#phoneCode').val() == '') {
            LayerFun('codeNotEmpty');
            return;
        }

        if (password == '') {
            LayerFun('passNotEmpty');
            return;
        }
        //hash资金密码绑定
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        Hash(token, hash_type, hash, pass_word_hash, phone, phoneCode, function (response) {
            if (response.errcode == '0') {
                LayerFun('bindSuccess');
                ActiveClick($this, btnText);
                if (wi_funPass !== 'wi_funPass') {
                    window.location.href = 'security.html';
                } else {
                    window.location.href = '../ba/BaWithdraw.html';
                }
            }
        }, function (response) {
            GetImgCode();
            GetErrorCode(response.errcode);
            ActiveClick($this, btnText);
        })
    })
});
