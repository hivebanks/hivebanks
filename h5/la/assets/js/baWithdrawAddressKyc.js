$(function () {
    //Get token
    var token = GetCookie('la_token');

    //Get the withdrawal address review list
    var api_url = 'kyc_la_ba_address_list.php';
    GetWithdrawAddressKyc(api_url, token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, tr = '', bind_flag = '';
            if (data == false) {
                GetDataEmpty('baWithdrawAddressKyc', '5');
                return;
            }
            $.each(data, function (i, val) {
                if (data[i].bind_flag == '0') {
                    bind_flag = 'underReview';
                }
                tr += '<tr class="withdrawAddressItem">' +
                    '<td><span class="ba_id">' + data[i].ba_id + '</span></td>' +
                    '<td><span class="" name="">' + data[i].bind_info + '</span></td>' +
                    '<td><span class="i18n" name="underReview">' + bind_flag + '</span></td>' +
                    '<td><span>' + data[i].ctime + '</span></td>' +
                    '<td>' +
                    '<span class="bind_id none">' + data[i].bind_id + '</span>' +
                    '<div>' +
                    '<button class="btn btn-success btn-sm withdrawAddressConfirmBtn i18n" name="pass">pass</button>' +
                    '<button class="btn btn-danger btn-sm margin-left-5 withdrawAddressRefusesBtn i18n" name="refuse">refuse</button>' +
                    '</div>' +
                    '</td>' +
                    '</tr>'
            });
            $('#baWithdrawAddressKyc').html(tr);
            execI18n();
        }
    }, function (response) {
        GetDataFail('baWithdrawAddressKyc', '5');
        LayerFun(response.errcode);
        return;
    });

    //Cash ba withdrawal address
    $(document).on('click', '.withdrawAddressConfirmBtn', function () {
        var _this = $(this);
        var ba_id = $(this).parents('.withdrawAddressItem').find('.ba_id').text();
        var bind_id = $(this).parents('.withdrawAddressItem').find('.bind_id').text();
        var api_url = 'kyc_la_ba_address_confirm.php';
        $(".preloader-wrapper").addClass("active");
        ConfirmBaWithdrawAddress(api_url, token, ba_id, bind_id, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                LayerFun('successfulProcessing');
                _this.closest('.withdrawAddressItem').remove();
                return;
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            LayerFun(response.errcode);
            return;
        })
    });

    //Reject ba withdrawal address
    $(document).on('click', '.withdrawAddressRefusesBtn', function () {
        var _this = $(this);
        var ba_id = $(this).parents('.withdrawAddressItem').find('.ba_id').text();
        var bind_id = $(this).parents('.withdrawAddressItem').find('.bind_id').text();
        var api_url = 'kyc_la_ba_address_refuse.php';
        $(".preloader-wrapper").addClass("active");
        ConfirmBaWithdrawAddress(api_url, token, ba_id, bind_id, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                LayerFun('successfulProcessing');
                _this.closest('.withdrawAddressItem').remove();
                return;
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            LayerFun(response.errcode);
            return;
        })
    });
});