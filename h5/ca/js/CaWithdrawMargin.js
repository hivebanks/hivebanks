$(function () {
    //获取token
    var token = GetCookie('ca_token');
    GetCaAccount();

    //获取图形验证码
    GetImgCode();

    //    切换验证码
    $('#email_imgCode, #phone_imgCode').click(function () {
        GetImgCode();
    });

    //获取手机验证码
    $('.phoneCodeBtn').click(function () {
        var bind_type = '2', $this = $(this), cfm_code = $('.phoneCfmCode').val();
        if ($('.phoneCfmCode').val().length <= 0) {
            LayerFun('pleaseImgCode');
            return;
        }
        GetPhoneCodeFun(bind_type, $this, cfm_code);
    });

    //提现保证金
    $('.withdrawManageBtn').click(function () {
        var base_amount = $('#withdrawMargin').val(), fun_pass = $('#funPassword').val();
        WithdrawManage(token, base_amount, fun_pass, function (response) {
            if(response.errcode == '0'){
                LayerFun('submitSuccess');
                $('#withdrawMargin').val('');
                $('#funPassword').val('');
                // $('#imgCode').val('');
                // $('#phoneCode').val('');
                window.location.href = 'CaAccount.html';
            }
        }, function (response) {
            GetErrorCode(response.errcode);
        })
    });
});