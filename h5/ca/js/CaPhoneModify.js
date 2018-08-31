$(function () {
    //获取用户token
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
    //修改手机号码绑定
    $('.phoneEnable').click(function () {
        //获取国家代码
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