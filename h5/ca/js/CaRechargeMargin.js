$(function () {
    //获取token
    var token = GetCookie('ca_token');
    GetCaAccount();

    //充值保证金
    $('.rechargeMarginBtn').click(function () {
        var base_amount = $('#rechargeMargin').val();
        RechargeManage(token, base_amount, function (response) {
            if(response.errcode == '0'){
                LayerFun('submitSuccess');
                $('.rechargeFormRow').hide();
                $('.rechargeAddressRow').show();
                $('.addressInput').val(response.bit_address);
            }
        }, function (response) {
            GetErrorCode(response.errcode);
        })
    });

    //复制地址
    $('.copy_address').click(function(){
        new ClipboardJS('.copy_address');
        LayerFun('copySuccess');
    })
});