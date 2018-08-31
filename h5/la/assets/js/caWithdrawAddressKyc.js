$(function () {
    //获取token
    var token = GetCookie('la_token');

    //获取提现地址审核列表
    var api_url = 'kyc_la_ca_address_list.php';
    GetWithdrawAddressKyc(api_url, token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, tr = '', bind_flag = '';
            if (data == false) {
                GetDataEmpty('caWithdrawAddressKyc', '5');
                return;
            }
            $.each(data, function (i, val) {
                if(data[i].bind_flag == '0'){
                    bind_flag = 'underReview';
                }
                tr += '<tr class="withdrawAddressItem">' +
                    '<td><span class="ca_id">' + data[i].ca_id + '</span></td>' +
                    '<td><span>' + data[i].bind_info + '</span></td>' +
                    '<td><span class="i18n" name="underReview">'+ bind_flag + '</span></td>' +
                    '<td><span>' + data[i].ctime + '</span></td>' +
                    '<td>' +
                    '<span class="bind_id none">'+ data[i].bind_id +'</span>' +
                    '<div>' +
                    '<button class="btn btn-success btn-sm withdrawAddressConfirmBtn i18n" name="pass">通过</button>' +
                    '<button class="btn btn-danger btn-sm margin-left-5 withdrawAddressRefusesBtn i18n" name="refuse">拒绝</button>' +
                    '</div>' +
                    '</td>' +
                    '</tr>'
            });
            $('#caWithdrawAddressKyc').html(tr);
            execI18n();
        }
    }, function (response) {
        GetDataFail('caWithdrawAddressKyc', '5');
        GetErrorCode(response.errcode);
        return;
    });

    //通过ca提现地址
    $(document).on('click', '.withdrawAddressConfirmBtn', function () {
        var _this = $(this);
        var ca_id = $(this).parents('.withdrawAddressItem').find('.ca_id').text();
        var bind_id = $(this).parents('.withdrawAddressItem').find('.bind_id').text();
        var api_url = 'kyc_la_ca_address_confirm.php';
        ConfirmCaWithdrawAddress(api_url, token, ca_id, bind_id, function (response) {
            if(response.errcode == '0'){
                LayerFun('successfulProcessing');
                _this.closest('.withdrawAddressItem').remove();
                return;
            }
        }, function (response) {
            GetErrorCode(response.errcode);
            return;
        })
    });

    //拒绝ca提现地址
    $(document).on('click', '.withdrawAddressRefusesBtn', function () {
        var _this = $(this);
        var ca_id = $(this).parents('.withdrawAddressItem').find('.ca_id').text();
        var bind_id = $(this).parents('.withdrawAddressItem').find('.bind_id').text();
        var api_url = 'kyc_la_ca_address_refuse.php';
        ConfirmCaWithdrawAddress(api_url, token, ca_id, bind_id, function (response) {
            if(response.errcode == '0'){
                LayerFun('successfulProcessing');
                _this.closest('.withdrawAddressItem').remove();
                return;
            }
        }, function (response) {
            GetErrorCode(response.errcode);
            return;
        })
    });
});