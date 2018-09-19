$(function () {
    //get token
    var token = GetCookie('ba_token');
    GetBaAccount();

    //Get graphic verification code
    GetImgCode();

    //    Switch verification code
    $('#email_imgCode, #phone_imgCode').click(function () {
        GetImgCode();
    });

    //Get phone verification code
    $('.phoneCodeBtn').click(function () {
        var bind_type = '2', $this = $(this), cfm_code = $('.phoneCfmCode').val();
        if ($('.phoneCfmCode').val().length <= 0) {
            LayerFun('pleaseImgCode');
            return;
        }
        setTime($this);
        GetPhoneCodeFun(bind_type, $this, cfm_code);
    });

    //Withdrawal margin
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
            LayerFun(response.errcode);
        })
    });
});