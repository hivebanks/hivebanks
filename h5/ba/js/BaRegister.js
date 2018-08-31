$(function () {
    //是否允许注册
    var type = 'ba';
    RegisterSwitch(type, function (response) {
        if(response.errcode == '0'){
            var data = response.rows;
            if(data[0].option_name == 'ba_lock' && data[0].is_open == '0'){
                $('.form-box').remove();
                $('.login-wrap').remove();
                $('.form_col').html('<h2 style="color: #fff" class="i18n" name="unableRegister">暂时无法注册，请等待管理员开启注册权限...</h2>');
                execI18n();
                return;
            }
        }
    }, function (response) {
        GetErrorCode(response.errcode);
        return;
    });

    //获取代理方式
    GetAgentMode(function (response) {
        var li = '';
        if(response.errcode == '0'){
            var data = response.rows;
            if(data == false){
                //noSelect
                $('.emailSelectInput').attr('selectname', 'noSelect');
                $('.phoneSelectInput').attr('selectname', 'noSelect');
                execI18n();
                return;
            }
            $.each(data, function (i, val) {
                li+='<li class="bit_type">'+ data[i].option_key +'</li>'
            });
            $('ul.select').html(li);
        }
    }, function (response) {

    });
    //选择代理方式
    $('.emailSelectInput').click(function(){
        $('.emailSelect').slideDown('fast');
    });
    $('.phoneSelectInput').click(function(){
        $('.phoneSelect').slideDown('fast');
    });

    GetImgCode();

    $('#phone_imgCode').click(function () {
        GetImgCode();
    });

    // 切换邮箱和手机注册
    $('.registerToggle').click(function(){
        $(this).addClass('active').siblings().removeClass('active');
    });
    // 切换邮箱注册
    $('.emailRegister').click(function(){
        $('.phoneRegisterBox').fadeOut();
        $('.emailRegisterBox').fadeIn();
    });
    // 切换手机注册
    $('.phoneRegister').click(function(){
        $('.emailRegisterBox').fadeOut();
        $('.phoneRegisterBox').fadeIn();
    });
    //邮箱选择代理商
    $(document).on('click', '.emailSelect li', function(){
        $('.emailSelectInput').val($(this).text());
        $('.emailSelect').slideUp('fast');
    });
    //手机选择代理商
    $(document).on('click','.phoneSelect li', function(){
        $('.phoneSelectInput').val($(this).text());
        $('.phoneSelect').slideUp('fast');
    });

    // 监听邮箱注册输入
    //emailInput
    $('.email').blur(function () {
        var email = $('.email').val();
        if (email.length <= 0) {//是否为空
            $('.email_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else {
            $('.email_tips').fadeOut('fast');
        }
        if (!IsEmail(email)) {//邮箱格式错误
            $('.emailErrorTips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else {
            $('.emailErrorTips').fadeOut('fast');
        }
    });

    //emailPassInput
    $('#emailPass').blur(function () {
        var emailPass = $('#emailPass').val();
        if (emailPass.length <= 0) {//是否为空
            $('.password_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else if (emailPass.length < 8) {
            $('.errEmailPass_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else {
            $('.password_tips').fadeOut('fast');
            $('.errEmailPass_tips').fadeOut('fast');
        }
    });

    //againEmailPasswordInput
    $('.againEmailPassword').blur(function () {
        var againEmailPassword = $('.againEmailPassword').val();
        if (againEmailPassword.length <= 0) {//是否为空
            $('.emailAgainPassword_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else if (againEmailPassword != $('#emailPass').val()) {
            $('.emailSamePassword_tips').fadeIn('fast').siblings('span').fadeOut('fast');
        } else {
            $('.emailAgainPassword_tips').fadeOut('fast');
            $('.emailSamePassword_tips').fadeOut('fast');
        }
    });

    // ========邮箱注册========
    var _email = '', emailList = '';
    $('.emailRegisterBtn').click(function () {
        var email = $('.email').val(),
            pass_word = $('.emailPassword').val(),
            againEmailPassword = $('.againEmailPassword').val(),
            pass_word_hash = hex_sha1(pass_word),
            bit_type = $('.emailSelectInput').val();

        if (email.length <= 0) {
            GetErrorCode('emailNotEmpty');
            $('.email_tips').fadeIn();
            return;
        }
        if (bit_type.length <= 0) {
            GetErrorCode('proxyNotEmpty');
            $('.emailProxy_tips').fadeIn();
            return;
        }
        if (pass_word.length <= 0) {
            GetErrorCode('passwordNotEmpty');
            $('.password_tips').fadeIn();
            return;
        }
        if (againEmailPassword.length <= 0) {
            GetErrorCode('confirmPasswordNotEmpty');
            $('.emailAgainPassword_tips').fadeIn();
            return;
        }
        if(pass_word != againEmailPassword){
            GetErrorCode('TwoPassword');
            $('.emailSamePassword_tips').fadeIn();
            return;
        }

        _email = email.split('@')[1];
        emailList = EmailList();

        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        EmailRegister(email, pass_word, pass_word_hash, bit_type, function (response) {
            ActiveClick($this, btnText);
            if (response.errcode == '0') {
                $('.email').val('');
                $('.emailPassword').val('');
                $('.againEmailPassword').val('');
                $('.emailInvitCode').val('');
                $('#registerSuccess').modal('show');//注册成功过显示提示
            }
        }, function (response) {
            ActiveClick($this, btnText);
            if (response.errcode == '105') {
                $('.emailLoginTips').fadeIn('fast');
                return;
            }
            if (response.errcode == '121') {
                // $('#registerSuccess').modal('show');
                $('#alreadyRegister').modal('show');
                return;
            }
            GetImgCode();
            GetErrorCode(response.errcode);
            return;
        });
    });
    //前往邮箱验证
    $('.goEmailBtn').click(function () {
        window.location.href = 'BaLogin.html';
        window.open(emailList[_email]);
    });

    //phoneInput
    //phone
    $('#phone').focus(function () {
        $('.phone_tips').fadeOut('fast');
        $('.phoneErrorTips').fadeOut('fast');
        $('.phoneLoginTips').fadeOut('fast');
    });
    $('#phone').blur(function () {
        var phone = $('#phone').val();
        if (phone.length <= 0) {
            $('.phone_tips').fadeIn('fast').siblings('span').fadeOut();
        } else if (isNaN(phone)) {
            $('.phoneErrorTips').fadeIn('fast').siblings('span').fadeOut();
        } else {
            $('.phone_tips').fadeOut('fast');
            $('.phoneErrorTips').fadeOut('fast');
        }
    });

    //phoneCfmCode-
    $('.phoneCfmCode').blur(function () {
        var phoneCfmCode = $('.phoneCfmCode').val();
        if (phoneCfmCode.length <= 0) {
            $('.phoneCode_tips').fadeIn('fast').siblings('span').fadeOut();
        } else {
            $('.phoneCode_tips').fadeOut('fast');
            $('.errPhoneCode_tips').fadeOut('fast');
        }
    });

    //phoneSmsCode-
    $('.phoneSmsCode').focus(function () {
        $('.phoneSmsCode_tips').fadeOut('fast');
        $('.phoneCode_expired').fadeOut('fast');
    });
    $('.phoneSmsCode').blur(function () {
        var phoneSmsCode = $('.phoneSmsCode').val();
        if (phoneSmsCode.length <= 0) {
            $('.phoneSmsCode_tips').fadeIn('fast').siblings('span').fadeOut();
        } else {
            $('.phoneSmsCode_tips').fadeOut('fast');
        }
    });

    //phonePassword
    $('#phonePass').blur(function () {
        var phonePass = $('#phonePass').val();
        if (phonePass.length <= 0) {
            $('.PhonePassword_tips').fadeIn('fast').siblings('span').fadeOut();
        } else if (phonePass.length <= 0) {
            $('.errPhonePass_tips').fadeIn('fast').siblings('span').fadeOut();
        } else {
            $('.PhonePassword_tips').fadeOut('fast');
            $('.errPhonePass_tips').fadeOut('fast');
        }
    });

    //phoneAgainPassword
    $('.againPhonePassword').blur(function () {
        var againPhonePassword = $('.againPhonePassword').val();
        if (againPhonePassword.length <= 0) {
            $('.phoneAgainPassword_tips').fadeIn('fast').siblings('span').fadeOut();
        } else if (againPhonePassword != $('#phonePass').val()) {
            $('.phoneSamePassword_tips').fadeIn('fast').siblings('span').fadeOut();
        } else {
            $('.phoneAgainPassword_tips').fadeOut('fast');
            $('.phoneSamePassword_tips').fadeOut('fast');
        }
    });

    //获取手机验证码
    $('.phoneCodeBtn').click(function () {
        var bind_type = '1', $this = $(this), cfm_code = $('.phoneCfmCode').val();
        if (cfm_code.length <= 0) {
            GetErrorCode('codeNotEmpty');
            $('.emailCode_tips').fadeIn();
            return;
        }
        GetPhoneCodeFun(bind_type, $this, cfm_code);
    });
    /**
     /* ========手机注册========
     * 点击注册提交
     */
    $('.phoneRegisterBtn').click(function () {
        var country_code = $('.selected-dial-code').text().split("+")[1];
        // 获取用户输入的内容---判断
        var cellphone = $('.phone').val(),
            sms_code = $('.phoneSmsCode').val(),
            phoneCfmCode = $('.phoneCfmCode').val(),
            pass_word = $('.phonePassword').val(),
            again_pass_word = $('.againPhonePassword').val(),
            pass_word_hash = hex_sha1(pass_word),
            bit_type = $('.phoneSelectInput').val();
        if (cellphone.length <= 0) {
            GetErrorCode('accountNotEmpty');
            $('.phone_tips').fadeIn();
            return;
        }
        if (pass_word.length <= 0) {
            GetErrorCode('passwordNotEmpty');
            $('.phonePassword_tips').fadeIn();
            return;
        }
        if (again_pass_word.length <= 0) {
            GetErrorCode('confirmPasswordNotEmpty');
            $('.phoneAgainPassword_tips').fadeIn();
            return;
        }
        if(pass_word != again_pass_word){
            GetErrorCode('TwoPassword');
            $('.phoneSamePassword_tips').fadeIn();
            return;
        }
        if (bit_type.length <= 0) {
            GetErrorCode('proxyNotEmpty');
            $('.phoneProxy_tips').fadeIn();
            return;
        }
        if (phoneCfmCode.length <= 0) {
            GetErrorCode('codeNotEmpty');
            $('.emailCode_tips').fadeIn();
            return;
        }
        if (sms_code.length <= 0) {
            GetErrorCode('codeNotEmpty');
            $('.phoneCode_tips').fadeIn();
            return;
        }
        var $this = $(this), btnText = $(this).text();
        if (DisableClick($this)) return;
        PhoneRegister(country_code, cellphone, bit_type, pass_word, pass_word_hash, sms_code, function (response) {
            ActiveClick($this, btnText);
            if (response.errcode == '0') {
                $('.phone').val('');
                $('.phoneCfmCode').val('');
                $('.phonePassword').val('');
                $('.againPhonePassword').val('');
                $('.phoneSelectInput').val('');
                window.location.href = 'BaRegisterSuccess.html';
                // window.location.href = 'BaLogin.html?name=phone';
            }
        }, function (response) {
            ActiveClick($this, btnText);
            if(response.errcode == 100){
                $('.phoneErrorTips').fadeIn('fast');
            }
            if (response.errcode == 105) {
                $('.phoneLoginTips').fadeIn('fast');
            }
            if (response.errcode == 111) {
                $('.phoneCode_expired').fadeIn('fast');
            }
            GetImgCode();
            GetErrorCode(response.errcode);
            return;
        });
    });
});








