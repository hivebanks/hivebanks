$(document).ready(function () {
    function GetLoginCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
    }
    //获取图形验证码
    GetImgCode();
    //    切换验证码
    $('#email_imgCode, #phone_imgCode').click(function () {
        GetImgCode();
    });

    // 切换邮箱和手机登录样式
    $(".loginToggle").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
    });
    // 切换邮箱登录
    $(".emailLogin").click(function () {
        $(".phoneLoginBox").fadeOut();
        $(".emailLoginBox").fadeIn();
        $('.phonePassword').removeClass('.pass');
        GetImgCode();
    });
    // 切换手机登录
    $(".phoneLogin").click(function () {
        $(".emailLoginBox").fadeOut();
        $(".phoneLoginBox").fadeIn();
        $('.emailPassword').removeClass('.pass');
        GetImgCode();
    });
    // ========邮箱登录========
    $('.emailCanvas').click(function () {//点击更换验证码
        GetImgCode();
    });
    // email表单change判断
    //email判断
    $('.email').focus(function () {
        $('.email_tips').fadeOut('fast');
        $('.emailErrorTips').fadeOut('fast');
        $('.emailAccountNot').fadeOut('fast');
        $('.emailAuditFail').fadeOut('fast');
    });
    $('.email').blur(function () {
        var emailVal = $('.email').val();//获取邮箱内容
        if (emailVal.length <= 0) {//是否为空
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
        var emailPassword = $('.emailPassword').val();//获取邮箱内容
        if (emailPassword.length <= 0) {//是否为空
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
        var emailCfmCode = $('.emailCfmCode').val();//获取邮箱内容
        if (emailCfmCode.length <= 0) {//是否为空
            $('.emailImgCode_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else {
            $('.emailImgCode_tips').fadeOut('fast');
            $('.errEmailImgCode_tips').fadeOut('fast');
        }
    });

    // email提交判断
    var _email = '', emailList = '';
    $(".emailLoginBtn").click(function () {
        var user_token = GetLoginCookie('user_token');
        var email = $(".email").val(),
            emailPassword = $(".emailPassword").val(),
            pass_word_hash = hex_sha1(emailPassword),
            cfm_code = $(".emailCfmCode").val();

        if (email.length <= 0) {
            $('.email_tips').fadeIn().siblings('span').fadeOut();
            LayerFun('emailNotEmpty');
            return;
        }
        if (!IsEmail(email)) {
            $('.emailErrorTips').fadeIn().siblings('span').fadeOut();
            LayerFun('emailBad');
            return;
        }
        if (emailPassword.length <= 0) {
            $('.password_tips').fadeIn().siblings('span').hide();
            LayerFun('passwordNotEmpty');
            return;
        }
        if(user_token){
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
                SetCookie('user_token', token);
                window.location.href = 'account.html';
            }
        }, function (response) {
            ActiveClick($this, _text);
            if (response.errcode == '116') {//登录失败
                $('.emailLoginError').fadeIn('fast');
                var count = response.errmsg,
                    emailErrorNum = $('.emailErrorNum'),
                    emailLoginBtn = $('.emailLoginBtn'),
                    emailLoginError = $('.emailLoginError'),
                    emailInput = $('.emailLoginBox input');
                CountDown(count, emailErrorNum, emailLoginBtn, emailInput, emailLoginError);
            } else if (response.errcode == '112') {
                $('.emailAccountNot').fadeIn('fast');//用户不存在
            } else if (response.errcode == '113') {//未验证
                $('#emailVerification').modal('show');
            }
            if (response.errcode == '139') {
                $('.errEmailImgCode_tips').fadeIn('fast');//图形验证码错误
            }
            if (response.errcode == '118') {
                $('.emailAuditFail').fadeIn('fast');//未通过审核
            }
            GetImgCode();
            GetErrorCode(response.errcode);
            return;
        });
    });

    //前往邮箱验证
    $('.goEmailBtn').click(function () {
        window.open(emailList[_email]);
    });

    //手机注册返回登录显示
    var url = GetQueryString('name');
    if (url == 'phone') {
        $('.emailLogin').removeClass('active');
        $('.emailLoginBox').fadeOut('fast');
        $('.phoneLogin,.phoneLoginBox').addClass('active');
    }
    GetImgCode();

    //phoneForm 输入监听
    //phone
    $('#phone').focus(function () {
        $('.phone_tips').fadeOut('fast');
        $('.phoneErrorTips').fadeOut('fast');
        $('.phoneAccountNot').fadeOut('fast');
        $('.phoneAuditFail').fadeOut('fast');
    });
    $('#phone').blur(function () {
        var phone = $('#phone').val();
        if (phone.length <= 0) {
            $('.phone_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else if (isNaN(phone)) {
            $('.phoneErrorTips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else {
            $('.phone_tips').fadeOut('fast');
            $('.phoneErrorTips').fadeOut('fast');
            $('.phoneAuditFail').fadeOut('fast');
        }
    });

    //phone password
    $('.phonePassword').blur(function () {
        var phonePassword = $('.phonePassword').val();
        if (phonePassword.length <= 0) {
            $('.phonePassword_tips').fadeIn('fast');
        } else {
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
        if (phoneCfmCode.length <= 0) {
            $('.phoneImgCode_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else {
            $('.phoneImgCode_tips').fadeOut('fast');
            $('.errPhoneImgCode_tips').fadeOut('fast');
        }
    });

    //phone phoneSmsCode
    $('#phoneSmsCode').blur(function () {
        var phoneSmsCode = $('#phoneSmsCode').val();
        if (phoneSmsCode.length <= 0) {
            $('.phoneSmsCode_tips').fadeIn('fast');
        } else {
            $('.phoneSmsCode_tips').fadeOut('fast');
        }
    });

    //获取手机验证码
    $('.phoneCodeBtn').click(function () {
        var bind_type = '2', $this = $(this), cfm_code = $('.phoneCfmCode').val();
        if ($('.phoneCfmCode').val().length <= 0) {
            $('.phoneCode_tips').fadeIn('fast');
            return;
        }
        GetPhoneCodeFun(bind_type, $this, cfm_code);
    });
    // ========手机登录========
    $('.phoneCanvas').click(function () {//点击切换验证码
        GetImgCode();
    });

    $(".phoneLoginBtn").click(function () {//点击登录提交
        var user_token = GetLoginCookie('user_token');
        // 获取国家代码
        var country_code = $('.selected-dial-code').text().split("+")[1];
        // 获取用户输入的内容---判断
        var cellphone = $("#phone").val(),
            cfm_code = $(".phoneCfmCode").val(),
            sms_code = $("#phoneSmsCode").val(),
            phonePassword = $(".phonePassword").val(),
            pass_word_hash = hex_sha1(phonePassword);
        if(cellphone.length <= 0){
            LayerFun('phoneNotEmpty');
            $('.phone_tips').fadeIn().siblings('span').hide();
            return;
        }
        if (cfm_code.length <= 0) {
            LayerFun('codeNotEmpty');
            $('.phoneImgCode_tips').fadeIn().siblings('span').hide();
            return;
        }
        if (sms_code.length <= 0) {
            LayerFun('codeNotEmpty');
            $('.phoneCode_tips').fadeIn();
            return;
        }

        if (phonePassword.length <= 0) {
            LayerFun('passwordNotEmpty');
            $('.Phonepassword_tips').fadeIn().siblings('span').hide();
            return;
        }
        if(user_token){
            LayerFun('noMoreAccount');
            return;
        }

        var $this = $(this), _text = $(this).text();
        if (DisableClick($this)) return;
        PhoneLogin(country_code, cellphone, pass_word_hash, sms_code, cfm_code, function (response) {
            ActiveClick($this, _text);
            if (response.errcode == '0') {
                $('#phone').val('');
                $('.phoneCfmCode').val('');
                $('#phoneSmsCode').val('');
                $('.phonePassword').val('');
                var token = response.token;
                SetCookie('user_token', token);
                window.location.href = 'account.html';
            }
        }, function (response) {
            GetImgCode();
            ActiveClick($this, _text);
            if (response.errcode == '116') {//登录失败
                $('.phoneLoginError').fadeIn('fast');
                var count = response.errmsg,
                    phoneErrorNum = $('.phoneErrorNum'),
                    phoneLoginBtn = $('.phoneLoginBtn'),
                    phoneLoginError = $('.phoneLoginError'),
                    phoneInput = $('.phoneLoginBox input');
                CountDown(count, phoneErrorNum, phoneLoginBtn, phoneInput, phoneLoginError);
            } else if (response.errcode == '112') {
                $('.phoneAccountNot').fadeIn('fast');//用户不存在
            }
            if (response.errcode == '139') {
                $('.errPhoneImgCode_tips').fadeIn('fast');//图形验证码错误
            }
            if (response.errcode == '118') {
                $('.phoneAuditFail').fadeIn('fast');//未通过审核
            }
            GetErrorCode(response.errcode);
            return;
        });
    });
});

