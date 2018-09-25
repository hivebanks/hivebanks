$(document).ready(function () {
    function GetLoginCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
    }
    //Get graphic verification code
    GetImgCode();
    //    Switch verification code
    $('#email_imgCode, #phone_imgCode').click(function () {
        GetImgCode();
    });

    // Switch mailbox and phone login styles
    $(".loginToggle").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
    });
    // Switch mailbox login
    $(".emailLogin").click(function () {
        $(".phoneLoginBox").fadeOut();
        $(".emailLoginBox").fadeIn();
        $('.phonePassword').removeClass('.pass');
        GetImgCode();
    });
    // Switch phone login
    $(".phoneLogin").click(function () {
        $(".emailLoginBox").fadeOut();
        $(".phoneLoginBox").fadeIn();
        $('.emailPassword').removeClass('.pass');
        GetImgCode();
    });
    // ========email login========
    $('.emailCanvas').click(function () {//Click to replace the verification code
        GetImgCode();
    });
    // Email form change judgment
    //email判断
    $('.email').focus(function () {
        $('.email_tips').fadeOut('fast');
        $('.emailErrorTips').fadeOut('fast');
        $('.emailAccountNot').fadeOut('fast');
        $('.emailAuditFail').fadeOut('fast');
    });
    $('.email').blur(function () {
        var emailVal = $('.email').val();//Get mailbox content
        if (emailVal.length <= 0) {//Is it empty?
            $('.email_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else if (!IsEmail(emailVal)) {
            $('.emailErrorTips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else {
            $('.email_tips').fadeOut('fast');
            $('.emailErrorTips').fadeOut('fast');
            $('.emailAuditFail').fadeOut('fast');
        }
    });

    //email password判断
    $('.emailPassword').blur(function () {
        var emailPassword = $('.emailPassword').val();//Get mailbox content
        if (emailPassword.length <= 0) {//Is it empty?
            $('.password_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else {
            $('.password_tips').fadeOut('fast')
        }
    });

    //email emailCfmCode
    $('.emailCfmCode').focus(function () {
        $('.emailImgCode_tips').fadeOut('fast');
        $('.errEmailImgCode_tips').fadeOut('fast');
    });
    $('.emailCfmCode').blur(function () {
        var emailCfmCode = $('.emailCfmCode').val();//Get mailbox content
        if (emailCfmCode.length <= 0) {//Is it empty?
            $('.emailImgCode_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else {
            $('.emailImgCode_tips').fadeOut('fast');
            $('.errEmailImgCode_tips').fadeOut('fast');
        }
    });

    // emailSubmit judgment
    var _email = '', emailList = '';
    $(".emailLoginBtn").click(function () {
        var ca_token = GetLoginCookie('ca_token');
        var email = $(".email").val(),
            emailPassword = $(".emailPassword").val(),
            pass_word_hash = hex_sha1(emailPassword),
            cfm_code = $(".emailCfmCode").val();

        if (email.length <= 0) {
            LayerFun('emailNotEmpty');
            return;
        }
        if (!IsEmail(email)) {
            LayerFun('emailBad');
            return;
        }
        if (emailPassword.length <= 0) {
            LayerFun('passwordNotEmpty');
            return;
        }
        if(ca_token){
            LayerFun('noMoreAccount');
            return;
        }

        _email = email.split('@')[1];
        emailList = EmailList();
        var $this = $(this), _text = $(this).text();
        if (DisableClick($this)) return;
        EmailLogin(email, pass_word_hash, cfm_code, function (response) {
            ActiveClick($this, _text);
            if (response.errcode == '0') {
                $('.email').val('');
                $('.emailPassword').val('');
                $('.emailCfmCode').val('');
                LayerFun('loginSuccessful');
                var token = response.token;
                SetCookie('ca_token', token);
                window.location.href = 'CaAccount.html';
            }
        }, function (response) {
            ActiveClick($this, _text);
            if (response.errcode == '116') {//login fail
                $('.emailLoginError').fadeIn('fast');
                var count = response.errmsg,
                    emailErrorNum = $('.emailErrorNum'),
                    emailLoginBtn = $('.emailLoginBtn'),
                    emailLoginError = $('.emailLoginError'),
                    emailInput = $('.emailLoginBox input');
                CountDown(count, emailErrorNum, emailLoginBtn, emailInput, emailLoginError);
            } else if (response.errcode == '112') {
                $('.emailAccountNot').fadeIn('fast');//User Does Not Exist
            } else if (response.errcode == '113') {//Unverified
                $('#accountNotVerify').modal('show');
            }
            if (response.errcode == '139') {
                $('.errEmailImgCode_tips').fadeIn('fast');//Graphic verification code error
            }
            if (response.errcode == '118') {
                $('.emailAuditFail').fadeIn('fast');//not approved
            }
            GetImgCode();
            LayerFun(response.errcode);
            return;
        });
    });

    //Go to the mailbox to verify
    $('.goEmailBtn').click(function () {
        window.location.href = 'CaLogin.html';
        window.open(emailList[_email]);
    });

    //Phone registration returns to login display
    var url = GetQueryString('name');
    if (url == 'phone') {
        $('.emailLogin').removeClass('active');
        $('.emailLoginBox').fadeOut('fast');
        $('.phoneLogin,.phoneLoginBox').addClass('active');
    }
    GetImgCode();

    //phoneForm Input monitor
    //phone
    $('#phone').focus(function () {
        $('.phone_tips').fadeOut('fast');
        $('.phoneErrorTips').fadeOut('fast');
        $('.phoneAccountNot').fadeOut('fast');
        $('.phoneAuditFail').fadeOut('fast');
    });
    $('#phone').blur(function () {
        var phone = $('#phone').val();
        if(phone.length <= 0){
            $('.phone_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        }else if(isNaN(phone)){
            $('.phoneErrorTips').fadeIn('fast').siblings('span').fadeOut('fast');
        }else {
            $('.phone_tips').fadeOut('fast');
            $('.phoneErrorTips').fadeOut('fast');
            $('.phoneAuditFail').fadeOut('fast');
        }
    });

    //phone password
    $('.phonePassword').blur(function () {
        var phonePassword = $('.phonePassword').val();
        if(phonePassword.length <= 0){
            $('.phonePassword_tips').fadeIn('fast');
        }else {
            $('.phonePassword_tips').fadeOut('fast');
        }
    });

    //phone phoneCfmCode
    $('.phoneCfmCode').focus(function () {
        $('.phoneImgCode_tips').fadeOut('fast');
        $('.errPhoneImgCode_tips').fadeOut('fast');
    });
    $('.phoneCfmCode').blur(function () {
        var phoneCfmCode = $('.phoneCfmCode').val();
        if(phoneCfmCode.length <= 0){
            $('.phoneImgCode_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        }else {
            $('.phoneImgCode_tips').fadeOut('fast');
            $('.errPhoneImgCode_tips').fadeOut('fast');
        }
    });

    //phone phoneSmsCode
    // $('#phoneSmsCode').blur(function () {
    //     var phoneSmsCode = $('#phoneSmsCode').val();
    //     if(phoneSmsCode.length <= 0){
    //         $('.phoneSmsCode_tips').fadeIn('fast');
    //     }else {
    //         $('.phoneSmsCode_tips').fadeOut('fast');
    //     }
    // });

    //Get phone verification code
    // $('.phoneCodeBtn').click(function () {
    //     var bind_type = '2', $this = $(this), cfm_code = $('.phoneCfmCode').val();
    //     if($(".phone").val().length <= 0){
    //         $('.phone_tips').fadeIn().siblings('span').hide();
    //         LayerFun('phoneNotEmpty');
    //         return;
    //     }
    //     if ($('.phoneCfmCode').val().length <= 0) {
    //         $('.phoneImgCode_tips').fadeIn('fast');
    //         return;
    //     }
    //     setTime($this);
    //     GetPhoneCodeFun(bind_type, $this, cfm_code);
    // });
    // ========Log in with phone========
    $(".phoneLoginBtn").click(function () {//Click Login to submit
        var ca_token = GetLoginCookie('ca_token');
        // Get country code
        var country_code = $('.selected-dial-code').text().split("+")[1];
        // Get user input---判断
        var cellphone = $(".phone").val(),
            cfm_code = $(".phoneCfmCode").val(),
            sms_code = $("#phoneSmsCode").val(),
            phonePassword = $(".phonePassword").val(),
            pass_word_hash = hex_sha1(phonePassword);

        if (cellphone.length <= 0) {
            $('.phone_tips').fadeIn().siblings('span').hide();
            LayerFun('phoneNotEmpty');
            return;
        }

        if (cfm_code.length <= 0) {
            $('.phoneImgCode_tips').fadeIn().siblings('span').hide();
            LayerFun('codeNotEmpty');
            return;
        }
        if (sms_code.length <= 0) {
            $('.phoneCode_tips').fadeIn();
            LayerFun('codeNotEmpty');
            return;
        }

        if (phonePassword.length <= 0) {
            $('.Phonepassword_tips').fadeIn().siblings('span').hide();
            LayerFun('passwordNotEmpty');
            return;
        }
        if (phonePassword.length < 8) {
            $('.errPhonePass_tips').fadeIn().siblings('span').hide();
            LayerFun('PasswordStructure');
            return;
        }
        if(ca_token){
            LayerFun('noMoreAccount');
            return;
        }

        var $this = $(this), _text = $(this).text();
        if (DisableClick($this)) return;
        PhoneLogin(country_code, cellphone, pass_word_hash, cfm_code, sms_code, function (response) {
            ActiveClick($this, _text);
            if (response.errcode == '0') {
                $('#phone').val('');
                $('.phoneCfmCode').val('');
                $('.phonePassword').val('');
                $('#phoneSmsCode').val('');
                var token = response.token;
                SetCookie('ca_token', token);
                window.location.href = 'CaAccount.html';
            }
            if (response.errcode == "118") {
                $('.phoneAuditFail').fadeIn('fast');//not approved
            }
        }, function (response) {
            GetImgCode();
            ActiveClick($this, _text);
            if (response.errcode == '116') {//login fail
                $('.phoneLoginError').fadeIn('fast');
                var count = response.errmsg,
                    phoneErrorNum = $('.phoneErrorNum'),
                    phoneLoginBtn = $('.phoneLoginBtn'),
                    phoneLoginError = $('.phoneLoginError'),
                    phoneInput = $('.phoneLoginBox input');
                CountDown(count, phoneErrorNum, phoneLoginBtn, phoneInput, phoneLoginError);
            } else if (response.errcode == '112') {
                $('.phoneAccountNot').fadeIn('fast');//User Does Not Exist
            }
            if (response.errcode == '139') {
                $('.errPhoneImgCode_tips').fadeIn('fast');//Graphic verification code error
            }

            LayerFun(response.errcode);
            return;
        });
    });
});

