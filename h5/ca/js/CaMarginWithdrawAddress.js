$(function () {
//    //get token
    var token = GetCookie('ca_token');
    GetCaAccount();

//     //获取充值地址
    function GetWithdrawFun(){
        var li = '';
        GetMarginWithdrawAddress(token, function (response) {
            if(response.errcode == '0'){
                var data = response.rows;
                if(data == false){
                    li='<li class="i18n" name="noAddWithdrawAddress">没有添加提现地址</li>'
                }
                $.each(data, function (i, val) {
                    if(data[i].bind_flag == '1'){
                        li+='<li class="flex center space-between"><span>'+ data[i].bind_info +'</span><span class="i18n font-size-14" name="examinationPassed">审核通过</span></li>'
                    }else if(data[i].bind_flag == '2'){
                        li+='<li class="flex center space-between"><span>'+ data[i].bind_info +'</span><span class="i18n font-size-14 ty-color" name="auditFailed">审核未通过</span></li>'
                    }else {
                        li+='<li class="flex center space-between"><span>'+ data[i].bind_info +'</span><span class="i18n font-size-14" name="underReview">审核中</span></li>'
                    }

                });
                $('.marginWithdrawAddressBox').html(li);
                execI18n();
            }
        }, function (response) {
            GetDataFail('addressBox', '3');
            GetErrorCode(response.errcode);
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
        AddMarginWithdrawAddress(token, bit_address, fun_pass, function (response) {
            if(response.errcode == '0'){
                $('#withdrawAddress').val('');
                $('#fundPassword').val('');
                GetWithdrawFun();
            }
        }, function (response) {
            GetErrorCode(response.errcode);
        })
    })
//
//
});