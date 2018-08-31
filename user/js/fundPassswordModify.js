$(function () {
    //获取token
    var token = GetCookie('user_token');
    GetUsAccount();

    //获取图形验证码
    GetImgCode();
    //切换图形验证码
    $('#phone_imgCode').click(function () {
        GetImgCode();
    });

    //获取手机验证码
    $('.phoneCodeBtn').click(function(){
        var bind_type = '2', $this = $(this), cfm_code = $('#phoneCfmCode').val();
        if(cfm_code <= 0){
            LayerFun('pleaseImgCode');
            return;
        }
        GetPhoneCodeFun(bind_type, $this, cfm_code);
    });

    //绑定资金密码
    $('.fundPasswordEnable').click(function () {
        var hash_type = 'pass_hash',
            // 获取国家代码
            country_code = $(".selected-flag").attr("title").split("+")[1],
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
                SuccessCode('modify');
                ActiveClick($this, btnText);

                window.location.href = 'security.html';

            }
        }, function (response) {
            ActiveClick($this, btnText);
            GetErrorCode(response.errcode);
            GetImgCode();
        })
    })
});
