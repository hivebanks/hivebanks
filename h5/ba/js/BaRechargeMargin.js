$(function () {
    //获取token
    var token = GetCookie('ba_token');
    GetBaAccount();

    //充值保证金
    $('.rechargeManageBtn').click(function () {
        var base_amount = $('#rechargeMargin').val();
        RechargeManage(token, base_amount, function (response) {
            if(response.errcode == '0'){
                LayerFun("waitingPro");
                $('.rechargeFormRow').hide();
                $('.rechargeAddressRow').show();
                $('.addressInput').val(response.lgl_address);
            }
        }, function (response) {
            LayerFun("submissionFailed");
            GetErrorCode(response.errcode);
            return;
        })
    });

    //复制地址
    $('.copy_address').click(function(){
        new ClipboardJS('.copy_address');
        LayerFun('copySuccess');
    })
});