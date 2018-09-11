$(function () {
    //get token
    var token = GetCookie('ca_token');
    GetCaAccount();

    //Recharge deposit
    $('.rechargeMarginBtn').click(function () {
        var base_amount = $('#rechargeMargin').val();
        if(base_amount.length <= 0){
            LayerFun("pleaseEnterRechargeAmount");
            return;
        }
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        ShowLoading("show");
        RechargeManage(token, base_amount, function (response) {
            if(response.errcode == '0'){
                ShowLoading("hide");
                ActiveClick($this, btnText);
                LayerFun('submitSuccess');
                $('.rechargeFormRow').hide();
                $('.rechargeAddressRow').show();
                $('.addressInput').val(response.bit_address);
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
        })
    });

    //copy address
    $('.copy_address').click(function(){
        new ClipboardJS('.copy_address');
        LayerFun('copySuccess');
    })
});