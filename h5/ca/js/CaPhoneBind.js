$(function () {
    //token
    var token = GetCookie('ca_token');
    GetCaAccount();

    GetImgCode();
    $('#phone_imgCode').click(function () {
        GetImgCode();
    });
    //Get phone verification code
    $('.phoneCodeBtn').click(function () {
        var bind_type = '4', $this = $(this), cfm_code = $('#phoneCfmCode').val();
        if(cfm_code <= 0){
            LayerFun('pleaseImgCode');
            return;
        }
        setTime($this);
        GetPhoneCodeFun(bind_type, $this, cfm_code);
    });

    $('.phoneEnable').click(function () {
        // Get country code
        var country_code = $('.selected-dial-code').text().split("+")[1];
        var text_type = '4',
            phone = $('#phone').val(),
            text = country_code + "-" + phone,
            text_hash = $('#phoneCode').val();

        if (phone.length <= 0) {
            LayerFun('phoneNotEmpty');
            return;
        }

        if ($('#phoneCfmCode').val().length <= 0) {
            LayerFun('codeNotEmpty');
            return;
        }

        if ($('#phoneCode').val().length <= 0) {
            LayerFun('codeNotEmpty');
            return;
        }

        var $this = $(this);
        if (DisableClick($this)) return;
        ShowLoading("show");
        TextBind(token, text_type, text, text_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, 'Enable');
                $('#phone').val('');
                $('#phoneCode').val('');
                LayerFun('bindSuccess');
                window.location.href = 'CaSecurity.html';
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, 'Enable');
            if (response.errcode == '114') {
                window.location.href = 'login.html';
            }
            GetImgCode();
            LayerFun(response.errcode);
            return;
        })
    })

});