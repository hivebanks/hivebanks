$(function () {
    //获取token
    var token = GetCookie('la_token');
    var api_url = 'kyc_ba_reg_table.php', tr = '';
    RegisterKyc(api_url, token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, bind_flag = '';
            if(data == false){
                GetDataEmpty('baRegisterKyc', '5')
            }
            $.each(data, function (i, val) {
                if (data[i].bind_flag == '2') {
                    bind_flag = '审核中';
                } else {
                    bind_flag = data[i].bind_flag;
                }
                tr += '<tr class="registerItem">' +
                    '<td><span class="ba_id">' + data[i].ba_id + '</span></td>' +
                    '<td><span>' + data[i].bind_info + '</span></td>' +
                    '<td><span>' + data[i].ctime + '</span></td>' +
                    '<td><span class="i18n" name="underReview">' + bind_flag + '</span></td>' +
                    '<td>' +
                    '<span class="bind_id none">' + data[i].bind_id + '</span>' +
                    '<a href="javascript:;" class="registerSucBtn btn btn-success btn-sm i18n" name="pass">通过</a>' +
                    '<a href="javascript:;" class="registerRefBtn btn btn-danger btn-sm i18n" name="refuse">拒绝</a></td>' +
                    '</tr>';
            });
            $('#baRegisterKyc').html(tr);
            execI18n();
        }
    }, function (response) {
        if (response.errcode == '101') {
            GetDataEmpty('baRegisterKyc', '5');
        }
        GetErrorCode(response.errcode);
        return;
    });

    //通过审核
    $(document).on('click', '.registerSucBtn', function () {
        var api_url = 'kyc_ba_reg_confirm.php', _this = $(this);
        var bind_id = $(this).parent().children('.bind_id').text();
        RegisterPass(api_url, token, bind_id, function (response) {
            if (response.errcode == '0') {
                LayerFun('successfulProcessing');
                _this.closest('.registerItem').remove();
                return;
            }
        }, function (response) {
            LayerFun('processingFailure');
            GetErrorCode(response.errcode);
            return;
        })
    });

    //拒绝审核
    $(document).on('click', '.registerRefBtn', function () {
        var api_url = 'kyc_ba_reg_refuse.php', _this = $(this);
        var bind_id = $(this).parent().children('.bind_id').text();
        RegisterRef(api_url, token, bind_id, function (response) {
            if (response.errcode == '0') {
                LayerFun('successfulProcessing');
                _this.closest('.registerItem').remove();
                return;
            }
        }, function (response) {
            LayerFun('processingFailure');
            GetErrorCode(response.errcode);
            return;
        })
    });
});