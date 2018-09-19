$(function () {
    //get user token
    var token = GetCookie('ba_token');
    GetBaAccount();

    GetImgCode();
    $('#phone_imgCode').click(function () {
        GetImgCode();
    });
    //Get phone verification code
    $('.phoneCodeBtn').click(function () {
        var bind_type = '4', $this = $(this), cfm_code = $('#phoneCfmCode').val();
        if (cfm_code <= 0) {
            LayerFun('pleaseImgCode');
            return;
        }
        setTime($this);
        GetPhoneCodeFun(bind_type, $this, cfm_code);
    });

    $('.phoneEnable').click(function () {
        // Get country code
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
        ShowLoading("show");
        TextBind(token, text_type, text, text_hash, function (response) {
            if (response.errcode == '0') {
                ActiveClick($this, btnText);
                ShowLoading("hide");
                $('#phone').val('');
                $('#phoneCode').val('');
                LayerFun('bindSuccess');
                window.location.href = 'BaSecurity.html';
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
            return;
        })
    })

});