$(function () {
    //get user token
    var token = GetCookie('user_token');
    GetUsAccount();

    //Get graphic verification code
    GetImgCode();

    //Get phone verification code
    $('.phoneCodeBtn').click(function () {
        var bind_type = '2', $this = $(this), cfm_code = $('#phoneCfmCode').val();
        if (cfm_code <= 0) {
            LayerFun('pleaseImgCode');
            return;
        }
        setTime($this);
        GetPhoneCodeFun(bind_type, $this, cfm_code);
    });

    //Modify phone number binding
    $('.phoneEnable').click(function () {
        //Get country code
        var country_code = $(".selected-flag").attr("title").split("+")[1];
        var cellphone = $('#phone').val(),
            text = country_code + '-' + cellphone,
            text_hash = $('#phoneCode').val(),
            text_type = '4',
            pass_word_hash = hex_sha1($('#password').val());
        if (cellphone.length <= 0) {
            LayerFun('phoneNotEmpty');
            return;
        }
        if ($('#phoneCode').val().length <= 0) {
            LayerFun('codeNotEmpty');
            return;
        }
        if ($('#password').val().length <= 0) {
            LayerFun('passNotEmpty');
            return;
        }
        ShowLoading("show");
        TextModify(token, text_type, text, text_hash, pass_word_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                LayerFun('modifySuccess');
                window.location.href = "security.html";
                return;
            }
        }, function (response) {
            ShowLoading("hide");
            LayerFun(response.errcode);
            GetImgCode();
        });
    });
});