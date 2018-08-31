$(function () {
    //获取token
    var token = GetCookie('ba_token');
    GetBaAccount();

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
                LayerFun('waitingPro');
                $('#withdrawMargin').val('');
                $('#funPassword').val('');
                window.location.href = 'BaAccount.html';
            }
        }, function (response) {
            GetErrorCode(response.errcode);
        })
    });
});