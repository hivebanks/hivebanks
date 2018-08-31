$(function () {
//    //获取token
    var token = GetCookie('ba_token');
    GetBaAccount();
//
//     GetImgCode();
//     $('#phone_imgCode').click(function () {
//         GetImgCode();
//     });
//     //获取手机验证码
//     $('.phoneCodeBtn').click(function () {
//         var bind_type = '5', $this = $(this), cfm_code = $('#phoneCfmCode').val();
//         if(cfm_code <= 0){
//             LayerFun('pleaseImgCode');
//             return;
//         }
//         GetPhoneCodeFun(bind_type, $this, cfm_code);
//     });

//     //获取充值地址
    function GetWithdrawFun(){
        var li = '';
        GetMarginWithdrawAddress(token, function (response) {
            if(response.errcode == '0'){
                var data = response.rows;
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

    //添加提现地址
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