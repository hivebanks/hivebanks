$(function () {
    //获取图形验证码
    GetImgCode();
    //    切换验证码
    $('#phone_imgCode').click(function () {
        GetImgCode();
    });

    // 切换邮箱和手机重置密码
    $('.resetToggle').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });
    // 切换邮箱密码重置
    $('.emailReset').click(function () {
        $('.phoneResetBox').fadeOut();
        $('.emailResetBox').fadeIn();
    });
    // 切换手机密码重置
    $('.phoneReset').click(function () {
        $('.emailResetBox').fadeOut();
        $('.phoneResetBox').fadeIn();
    });
    // 重置邮箱监听
    //邮箱账号
    $('.email').focus(function () {
        $(this).siblings('span').hide();
    });
    $('.email').blur(function () {
        var email = $(this).val();
        if (email.length <= 0) {//邮箱账号为空
            $('.email_tips').fadeIn().siblings('span').fadeOut();
            return;
        }
        if (!IsEmail(email)) {//邮箱格式错误
            $('.emailErrorTips').fadeIn().siblings('span').fadeOut();
            return;
        }
    });

    //邮箱验证码
    $('.emailCfmCode').focus(function () {
        $('.emailCode_tips').hide();
    });
    $('.emailCfmCode').blur(function () {
        var emailcfmCode = $(this).val();
        if (emailcfmCode.length <= 0) {//邮箱验证码为空
            $('.emailCode_tips').fadeIn();
            return;
        }
    });

    //邮箱新密码
    $(".emailPassword").focus(function () {
        $(this).siblings('span').hide();
    });
    $('.emailPassword').blur(function () {
        var emailPassword = $(this).val();
        if (emailPassword.length <= 0) {
            $('.password_tips').fadeIn().siblings('span').hide();
            return;
        }
        if (emailPassword.length < 8) {
            $('.errEmailPass_tips').fadeIn().siblings('span').hide();
            return;
        }
    });

    // 重置邮箱获取验证码
    $('.emailCodeBtn').click(function () {
        var email = $('.email').val();
        if (email.length <= 0) {
            $('.email_tips').fadeIn().siblings('span').fadeOut();
            return;
        } else if (!IsEmail(email)) {
            $('.emailErrorTips').fadeIn().siblings('span').fadeOut();
            return;
        } else {
            GetEmailCode(email, function (response) {
                LayerFun('sendSuccess');
            }, function (response) {
                LayerFun('sendFail');
                GetErrorCode(response.errcode);
                return;
            });
        }

    });
    // 密码重置(邮箱)
    $('.emailResetBtn').click(function () {
        var email = $('.email').val(),
            cfm_code = $('.emailcfmCode').val(),
            emailPassword = $('.emailPassword').val(),
            pass_word_hash = hex_sha1(emailPassword);
        if (email == '') {
            LayerFun('emailNotEmpty');
            return;
        }
        if (!IsEmail(email)) {
            LayerFun('emailBad');
            return;
        }
        if (cfm_code == '') {
            LayerFun('codeNotEmpty');
            return;
        }
        if (emailPassword == '') {
            LayerFun('passwordNotEmpty');
            return;
        }
        var $this = $(this), btnText = $(this).text();
        if (DisableClick($this)) return;
        ResetEmailPassword(email, cfm_code, pass_word_hash, function (response) {
            ActiveClick($this, btnText);
            if (response.errcode == '0') {
                $('.email').val('');
                $('.emailcfmCode').val('');
                $('.emailPassword').val('');
                LayerFun('modifySuccess');
                DelCookie('token');
                window.location.href = 'CaLogin.html';
            }

        }, function (response) {
            ActiveClick($this, btnText);
            LayerFun('modifyFail');
            if (response.errcode == '120') {
                $('.noEmailTips').fadeIn('fast');
                return;
            }
            GetErrorCode(response.errcode);
            return;
        })
    });
    //重置手机监听
    //手机账号
    $('#phone').focus(function () {
        $(this).siblings('span').hide();
    });
    $('#phone').blur(function () {
        var phone = $(this).val();
        if(phone.length <= 0){
            $('.phone_tips').fadeIn().siblings('span').hide();
            return;
        }
        if(isNaN(phone)){
            $('.phoneErrorTips').fadeIn().siblings('span').hide();
            return;
        }
    });

    //图形验证码
    $('.phoneCfmCode').focus(function () {
        $(this).siblings('span').hide();
    });
    $('.phoneCfmCode').blur(function () {
        var phoneCfmCode = $(this).val();
        if(phoneCfmCode.length <= 0){
            $('.phoneImgCode_tips').fadeIn().siblings('span').hide();
            return;
        }
    });

    //手机验证码
    $('.phoneSmsCode').focus(function () {
        $(this).siblings('span').hide();
    });
    $('.phoneSmsCode').blur(function () {
        var phoneSmsCode = $(this).val();
        if(phoneSmsCode.length <= 0){
            $('.phoneCode_tips').fadeIn();
            return;
        }
    });

    //新密码
    $('.phonePassword').focus(function () {
        $(this).siblings('span').hide();
    });
    $('.phonePassword').blur(function () {
        var phonePassword = $(this).val();
        if(phonePassword.length <= 0){
            $('.PhonePassword_tips').fadeIn().siblings('span').hide();
            return;
        }
        if(phonePassword.length < 8){
            $('.errPhonePass_tips').fadeIn().siblings('span').hide();
            return;
        }
    });

    //获取手机验证码
    $('.phoneCodeBtn').click(function () {
        var bind_type = '3', $this = $(this), cfm_code = $('.phoneCfmCode').val();
        if ($('.phoneCfmCode').val().length <= 0) {
            $('.phoneCode_tips').fadeIn('fast');
            return;
        }
        GetPhoneCodeFun(bind_type, $this, cfm_code);
    });
    // 密码重置(手机)
    $('.phoneResetBtn').click(function () {
        // 获取国家代码
        var country_code = $('.selected-dial-code').text().split("+")[1];
        var cellphone = $('.phone').val(),
            cfm_code = $('.phoneCfmCode').val(),
            sms_code = $('.phoneSmsCode').val(),
            phonePassword = $('.phonePassword').val(),
            pass_word_hash = hex_sha1(phonePassword);
        if (cellphone == '') {
            $('.phone_tips').fadeIn().siblings('span').hide();
            LayerFun('phoneNotEmpty');
            return;
        }

        if (cfm_code == '') {
            $('.phoneImgCode_tips').fadeIn().siblings('span').hide();
            LayerFun('codeNotEmpty');
            return;
        }
        if (sms_code == '') {
            $('.phoneCode_tips').fadeIn();
            LayerFun('codeNotEmpty');
            return;
        }

        if (phonePassword == '') {
            $('.Phonepassword_tips').fadeIn().siblings('span').hide();
            LayerFun('passwordNotEmpty');
            return;
        }
        if (phonePassword.length < 8) {
            $('.errPhonePass_tips').fadeIn().siblings('span').hide();
            LayerFun('PasswordStructure');
            return;
        }

        var $this = $(this), btnText = $(this).text();
        if (DisableClick($this)) return;
        ResetPhonePassword(country_code, cellphone, sms_code, pass_word_hash, function (response) {
            ActiveClick($this, btnText);
            if (response.errcode == '0') {
                $('.phone').val('');
                $('.phonecfmCode').val('');
                $('.phonePassword').val('');
                LayerFun('modifySuccess');
                DelCookie('token');
                window.location.href = 'CaLogin.html';
            }

        }, function (response) {
            ActiveClick($this, btnText);
            if(response.errcode == '112'){
                $('.noPhonelTips').fadeIn();
            }
            GetErrorCode(response.errcode);
            return;
        });
    });
});
