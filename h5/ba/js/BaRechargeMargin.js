$(function () {
    //get token
    var token = GetCookie('ba_token');
    GetBaAccount();

    //Recharge deposit
    $('.rechargeManageBtn').click(function () {
        var base_amount = $('#rechargeMargin').val();
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        ShowLoading("show");
        RechargeManage(token, base_amount, function (response) {
            if(response.errcode == '0'){
                ShowLoading("hide");
                ActiveClick($this, btnText);
                LayerFun("waitingPro");
                $('.rechargeFormRow').hide();
                $('.rechargeAddressRow').show();
                $('.addressInput').val(response.lgl_address);
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun("submissionFailed");
            LayerFun(response.errcode);
            return;
        })
    });

    //copy address
    $('.copy_address').click(function(){
        new ClipboardJS('.copy_address');
        LayerFun('copySuccess');
    })
});