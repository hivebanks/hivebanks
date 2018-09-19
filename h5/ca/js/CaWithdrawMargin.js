$(function () {
    //get token
    var token = GetCookie('ca_token');
    GetCaAccount();

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
                LayerFun('submitSuccess');
                $('#withdrawMargin').val('');
                $('#funPassword').val('');
                // $('#imgCode').val('');
                // $('#phoneCode').val('');
                window.location.href = 'CaAccount.html';
            }
        }, function (response) {
            LayerFun(response.errcode);
        })
    });
});