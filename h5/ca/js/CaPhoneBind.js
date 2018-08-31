$(function () {
    //token
    var token = GetCookie('ca_token');
    GetCaAccount();

    GetImgCode();
    $('#phone_imgCode').click(function () {
        GetImgCode();
    });
    //获取手机验证码
    $('.phoneCodeBtn').click(function () {
        var bind_type = '4', $this = $(this), cfm_code = $('#phoneCfmCode').val();
        if(cfm_code <= 0){
            LayerFun('pleaseImgCode');
            return;
        }
        GetPhoneCodeFun(bind_type, $this, cfm_code);
    });

    $('.phoneEnable').click(function () {
        // 获取国家代码
        var country_code = $('.selected-dial-code').text().split("+")[1];
        var text_type = '4',
            phone = $('#phone').val(),
            text = country_code + "-" + phone,
            text_hash = $('#phoneCode').val();

        if (text == '') {
            LayerFun('phoneNotEmpty');
            return;
        }

        if ($('.phoneCode').val() == '') {
            LayerFun('codeNotEmpty');
            return;
        }

        var $this = $(this);
        if (DisableClick($this)) return;
        TextBind(token, text_type, text, text_hash, function (response) {
            ActiveClick($this, 'Enable');
            if (response.errcode == '0') {
                $('#phone').val('');
                $('#phoneCode').val('');
                // $('#password').val('');
                LayerFun('bindSuccess');
                window.location.href = 'CaSecurity.html';
            }
        }, function (response) {
            ActiveClick($this, 'Enable');
            if (response.errcode == '114') {
                window.location.href = 'login.html';
            }
            GetImgCode();
            GetErrorCode(response.errcode);
            return;
        })
    })

});