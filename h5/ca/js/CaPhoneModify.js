$(function () {
    //get user token
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
        var $this = $(this).text(), btnText = $(this).text();
        if(DisableClick($this)) return;
        TextModify(token, text_type, text, text_hash, pass_word_hash, function (response) {
            if (response.errcode == '0') {
                ActiveClick($this, btnText);
                LayerFun('modifySuccess');
                return;
            }
        }, function (response) {
            ActiveClick($this, btnText);
            GetImgCode();
            GetErrorCode(response.errcode);
            return;
        });
    });
});