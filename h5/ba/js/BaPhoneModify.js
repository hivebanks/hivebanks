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
        if(cfm_code <= 0){
            LayerFun('pleaseImgCode');
            return;
        }
        setTime($this);
        GetPhoneCodeFun(bind_type, $this, cfm_code);
    });
    //Modify phone number binding
    $('.phoneEnable').click(function () {
        //Get country code
        var country_code = $('.selected-dial-code').text().split("+")[1];
        var cellphone = $('#phone').val(),
            text = country_code + '-' + cellphone,
            text_hash = $('#phoneCode').val(),
            text_type = '4',
            pass_word_hash = hex_sha1($('#password').val());
        if (cellphone == '') {
            LayerFun('phoneNotEmpty');
            return;
        }
        if ($('#phoneCode').val() == '') {
            LayerFun('codeNotEmpty');
            return;
        }
        if ($('#password').val() == '') {
            LayerFun('passwordNotEmpty');
            return;
        }
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        TextModify(token, text_type, text, text_hash, pass_word_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                LayerFun('successfullyModified');
                return;
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
            return;
        });
    });
});