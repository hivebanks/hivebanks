$(function () {
    //获取用户token
    var token = GetCookie('ba_token');
    GetBaAccount();

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
        var country_code = $('.selected-dial-code').text().split("+")[1],
            text_type = '4',
            text = country_code + '-' + $('#phone').val(),
            text_hash = $('#phoneCode').val();

        if ($('#phone').val() == '') {
            LayerFun('phoneNotEmpty');
            return;
        }

        if ($('.phoneCode').val() == '') {
            LayerFun('codeNotEmpty');
            return;
        }

        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        TextBind(token, text_type, text, text_hash, function (response) {
            ActiveClick($this, btnText);
            if (response.errcode == '0') {
                $('#phone').val('');
                $('#phoneCode').val('');
                LayerFun('bindSuccess');
                window.location.href = 'BaSecurity.html';
            }
        }, function (response) {
            ActiveClick($this, btnText);
            GetErrorCode(response.errcode);
            return;
        })
    })

});