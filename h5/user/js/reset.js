$(function () {
    //Get graphic verification code
    GetImgCode();
    //    Switch verification code
    $('#phone_imgCode').click(function () {
        GetImgCode();
    });

    // Switch mailbox and phone reset password
    $('.resetToggle').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });

    // Switch mailbox password reset
    $('.emailReset').click(function () {
        $('.phoneResetBox').fadeOut();
        $('.emailResetBox').fadeIn();
    });

    // Switch phone password reset
    $('.phoneReset').click(function () {
        $('.emailResetBox').fadeOut();
        $('.phoneResetBox').fadeIn();
        GetImgCode();
    });

    // Reset mailbox listener
    //email address
    $('.email').focus(function () {
        $(this).siblings('span').hide();
    });
    $('.email').blur(function () {
        var email = $(this).val();
        if (email.length <= 0) {//Email account is empty
            $('.email_tips').fadeIn().siblings('span').fadeOut();
            return;
        }
        if (!IsEmail(email)) {//Bad Mailbox Format
            $('.emailErrorTips').fadeIn().siblings('span').fadeOut();
            return;
        }
    });

    //E-mail verification code
    $('.emailcfmCode').focus(function () {
        $('.emailCode_tips').hide();
    });
    $('.emailcfmCode').blur(function () {
        var emailcfmCode = $(this).val();
        if (emailcfmCode.length <= 0) {//Email verification code is empty
            $('.emailCode_tips').fadeIn();
            return;
        }
    });

    //Mailbox new password
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

    // Reset email to get verification code
    $('.emailCodeBtn').click(function () {
        var email = $('.email').val();
        if (email.length <= 0) {
            $('.email_tips').fadeIn().siblings('span').fadeOut();
            return;
        } else if (!IsEmail(email)) {
            $('.emailErrorTips').fadeIn().siblings('span').fadeOut();
            return;
        }
        GetEmailCode(email, function (response) {
            LayerFun('sendSuccess');
        }, function (response) {
            LayerFun('sendFail');
            LayerFun(response.errcode);
            LayerFun(response.errcode);
            return;
        });

    });

    // Password reset (mailbox)
    $('.emailResetBtn').click(function () {
        var email = $('.email').val(),
            cfm_code = $('.emailcfmCode').val(),
            emailPassword = $('.emailPassword').val(),
            pass_word_hash = hex_sha1(emailPassword);
        if (email == '') {
            $('.email_tips').fadeIn().siblings('span').fadeOut();
            LayerFun('emailNotEmpty');
            return;
        }
        if (!IsEmail(email)) {
            $('.emailErrorTips').fadeIn().siblings('span').fadeOut();
            LayerFun('emailBad');
            return;
        }
        if (cfm_code == '') {
            $('.emailCode_tips').fadeIn();
            LayerFun('codeNotEmpty');
            return;
        }
        if (emailPassword == '') {
            $('.password_tips').fadeIn().siblings('span').hide();
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
            }

        }, function (response) {
            ActiveClick($this, btnText);
            LayerFun('modifyFail');
            if (response.errcode == '120') {
                $('.noEmailTips').fadeIn('fast');
                return;
            }

            if (response.errcode == '101') {
                LayerFun('accountOrCodeFail');
                execI18n();
                return;
            }
            if(response.errcode == "114"){
                DelCookie('token');
                window.location.href = 'login.html';
            }
        })
    });
    //Reset phone monitoring
    //phone account
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

    //Captcha
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

    //phone code
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

    //new password
    $('.phonePassword').focus(function () {
        $(this).siblings('span').hide();
    });
    $('.phonePassword').blur(function () {
        var phonePassword = $(this).val();
        if(phonePassword.length <= 0){
            $('.Phonepassword_tips').fadeIn().siblings('span').hide();
            return;
        }
        if(phonePassword.length < 8){
            $('.errPhonePass_tips').fadeIn().siblings('span').hide();
            return;
        }
    });

    //Get phone verification code
    $('.phoneCodeBtn').click(function () {
        var bind_type = '3', $this = $(this), cfm_code = $('.phoneCfmCode').val();
        if($(".phone").val().length <= 0){
            $('.phone_tips').fadeIn().siblings('span').hide();
            LayerFun('phoneNotEmpty');
            return;
        }
        if ($('.phoneCfmCode').val().length <= 0) {
            $('.phoneImgCode_tips').fadeIn('fast');
            return;
        }
        setTime($this);
        GetPhoneCodeFun(bind_type, $this, cfm_code);
    });
    // Password reset (mobile phone)
    $('.phoneResetBtn').click(function () {
        // Get country code
        var country_code = $('.selected-dial-code').text().split("+")[1];
        var cellphone = $('.phone').val(),
            cfm_code = $('.phoneCfmCode').val(),
            sms_code = $('.phoneSmsCode').val(),
            phonePassword = $('.phonePassword').val(),
            pass_word_hash = hex_sha1(phonePassword);
        if (cellphone == '') {
            LayerFun('phoneNotEmpty');
            $('.phone_tips').fadeIn().siblings('span').hide();
            return;
        }

        if (cfm_code == '') {
            LayerFun('codeNotEmpty');
            $('.phoneImgCode_tips').fadeIn().siblings('span').hide();
            return;
        }
        if (sms_code == '') {
            LayerFun('codeNotEmpty');
            $('.phoneCode_tips').fadeIn();
            return;
        }

        if (phonePassword == '') {
            LayerFun('passwordNotEmpty');
            $('.Phonepassword_tips').fadeIn().siblings('span').hide();
            return;
        }
        if (phonePassword.length < 8) {
            LayerFun('passwordNotEmpty');
            $('.PasswordStructure').fadeIn().siblings('span').hide();
            return;
        }

        var $this = $(this), btnText = $(this).text();
        if (DisableClick($this)) return;
        ResetPhonePassword(country_code, cellphone, sms_code, pass_word_hash, function (response) {
            ActiveClick($this, btnText);
            if (response.errcode == '0') {
                $('.phone').val('');
                $('.phoneCfmCode').val('');
                $('.phoneSmsCode').val('');
                $('.phonePassword').val('');
                LayerFun('modifySuccess');
            }

        }, function (response) {
            ActiveClick($this, btnText);
            LayerFun('modifyFail');
            if (response.errcode == '120') {
                $('.noPhonelTips').fadeIn('fast');
            }
            if(response.errcode == "114"){
                DelCookie('user_token');
                window.location.href = 'login.html';
            }
        });
    });
});
