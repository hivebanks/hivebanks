$(function () {
//    //get token
    var token = GetCookie('ba_token');
    GetBaAccount();

//     //get recharge address
    function GetWithdrawFun(){
        var li = '';
        GetMarginWithdrawAddress(token, function (response) {
            if(response.errcode == '0'){
                var data = response.rows;
                $.each(data, function (i, val) {
                    if(data[i].bind_flag == '1'){
                        li+='<li class="flex center space-between"><span>'+ data[i].bind_info +'</span><span class="i18n font-size-14" name="examinationPassed"></span></li>'
                    }else if(data[i].bind_flag == '2'){
                        li+='<li class="flex center space-between"><span>'+ data[i].bind_info +'</span><span class="i18n font-size-14 ty-color" name="auditFailed"></span></li>'
                    }else {
                        li+='<li class="flex center space-between"><span>'+ data[i].bind_info +'</span><span class="i18n font-size-14" name="underReview"></span></li>'
                    }

                });
                $('.marginWithdrawAddressBox').html(li);
                execI18n();
            }
        }, function (response) {
            GetDataFail('addressBox', '3');
            LayerFun(response.errcode);
            return;
        });
    }
    GetWithdrawFun();

    //Add withdrawal address
    $('.addWithdrawAddressBtn').click(function () {
        var bit_address = $('#withdrawAddress').val(), fun_pass = $('#fundPassword').val();
        if(bit_address.length <= 0){
            LayerFun('addressNotEmpty');
            return;
        }
        if(fun_pass.length <= 0){
            LayerFun('fundPassNotEmpty');
            return;
        }
        ShowLoading("show");
        AddMarginWithdrawAddress(token, bit_address, fun_pass, function (response) {
            if(response.errcode == '0'){
                ShowLoading("hide");
                $('#withdrawAddress').val('');
                $('#fundPassword').val('');
                GetWithdrawFun();
            }
        }, function (response) {
            ShowLoading("hide");
            LayerFun(response.errcode);
        })
    })
});