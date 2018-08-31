$(function () {
    //获取token
    var token = GetCookie('la_token');

    var api_url = 'kyc_ca_list.php', tr = '';
    KycList(api_url, token, function (response) {
        if(response.errcode == '0'){
                var data = response.rows, bind_info = '';
                if(data == false){
                    GetDataEmpty('caKyc', '5');
                    return;
                }
                $.each(data, function (i, val) {
                    if (data[i].bind_type == 'file' && data[i].bind_name == 'idPhoto') {
                        bind_info = "look";

                        tr += '<tr class="caKycItem">' +
                            '<td><span class="ca_id">' + data[i].ca_id + '</span></td>' +
                            '<td style="display: none"><span class="log_id">' + data[i].log_id + '</span></td>' +
                            '<td><span>' + data[i].bind_type + '</span></td>' +
                            '<td><span class="bind_name">' + data[i].bind_name + '</span></td>' +
                            '<td><a class="look i18n" name="look">' + bind_info + '</a><span class="none idPhotoSrc bind_info">' + data[i].bind_info + '</span></td>' +
                            '<td><span>' + data[i].ctime + '</span></td>' +
                            '<td><button class="btn btn-success btn-sm passBtn i18n" name="pass">通过</button></td>' +
                            '<td><button class="btn btn-danger btn-sm refuseBtn i18n" name="refuse">拒绝</button></td>' +
                            '</tr>';
                    } else {
                        bind_info = data[i].bind_info;
                        tr += '<tr class="caKycItem">' +
                            '<td><span class="ca_id">' + data[i].ca_id + '</span></td>' +
                            '<td style="display: none"><span class="log_id">' + data[i].log_id + '</span></td>' +
                            '<td><span>' + data[i].bind_type + '</span></td>' +
                            '<td><span class="bind_name">' + data[i].bind_name + '</span></td>' +
                            '<td><a class="bind_info">' + bind_info + '</a></td>' +
                            '<td><span>' + data[i].ctime + '</span></td>' +
                            '<td><button class="btn btn-success btn-sm passBtn i18n" name="pass">通过</button></td>' +
                            '<td><button class="btn btn-danger btn-sm refuseBtn i18n" name="refuse">拒绝</button></td>' +
                            '</tr>';
                    }

                });
                $('#caKyc').html(tr);
                execI18n();

        }
    }, function (response) {
        GetDataFail('caKyc', '5');
        // if(response.errcode == '404'){
            GetDataFail('caKyc', '5');
        // }
        GetErrorCode(response.errcode);
        return;
    });

    //确定审核通过
    $(document).on('click', '.passBtn', function () {
        var _this = $(this);

        var log_id = $(this).parents('.caKycItem').find('.log_id').text();

        ConfirmKycCa(token, log_id, function (response) {
            if (response.errcode == '0') {
                _this.closest('.caKycItem').remove();
                LayerFun('successfulProcessing');
                return;
            }
        }, function (response) {
            LayerFun('processingFailure');
            GetErrorCode(response.errcode);
            return;
        })
    });

    //拒绝审核
    $(document).on('click', '.refuseBtn', function () {
        var _this = $(this);
        var log_id = $(this).parents('.caKycItem').find('.log_id').text();

        RefuseKycCa(token, log_id, function (response) {
            if (response.errcode == '0') {
                _this.closest('.caKycItem').remove();
                LayerFun('successfulProcessing');
                return;
            }
        }, function (response) {
            LayerFun('processingFailure');
            GetErrorCode(response.errcode);
            return;
        })
    });

    //查看图片
    $(document).on('click', '.look', function () {
        var idPhotoSrc = $(this).parents('.caKycItem').find('.idPhotoSrc').text();
        var idPhotoSrcOne = idPhotoSrc.split(',')[0];
        var idPhotoSrcTwo = idPhotoSrc.split(',')[1];
        $('.idPhotoSrcOne').attr('src', idPhotoSrcOne);
        $('.idPhotoSrcTwo').attr('src', idPhotoSrcTwo);
        $('#lookImgModal').modal('open');
    });

    //初始化modal
    $('#lookImgModal').modal({
        dismissible: true,
        opacity: .5,
        in_duration: 300,
        out_duration: 200,
    });
});