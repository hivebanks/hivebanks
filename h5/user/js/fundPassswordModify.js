$(function () {
    //get token
    var token = GetCookie('user_token');
    GetUsAccount();

    //Get graphic verification code
    GetImgCode();

    //Switch graphic verification code
    $('#phone_imgCode').click(function () {
        GetImgCode();
    });

    //Get phone verification code
    $('.phoneCodeBtn').click(function(){
        var bind_type = '2', $this = $(this), cfm_code = $('#phoneCfmCode').val();
        if(cfm_code <= 0){
            LayerFun('pleaseImgCode');
            return;
        }
        GetPhoneCodeFun(bind_type, $this, cfm_code);
    });

    //Binding fund password
    $('.fundPasswordEnable').click(function () {
        var hash_type = 'pass_hash',
            // Get country code
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
        //hashFund password binding
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
            LayerFun(response.errcode);
            GetImgCode();
        })
    })
});
