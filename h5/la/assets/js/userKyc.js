$(function () {
    //获取token
    var token = GetCookie('la_token');

    var api_url = 'kyc_user_list.php', tr = '';
    KycList(api_url, token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, bind_info = '';
            $.each(data, function (i, val) {
                if (data[i].bind_type == 'file' && data[i].bind_name == 'idPhoto') {
                    bind_info = "look";

                    tr += '<tr class="userKycItem">' +
                        '<td><span class="us_id">' + data[i].us_id + '</span></td>' +
                        '<td style="display: none"><span class="log_id">' + data[i].log_id + '</span></td>' +
                        '<td><span>' + data[i].bind_type + '</span></td>' +
                        '<td><span class="bind_name">' + data[i].bind_name + '</span></td>' +
                        '<td><a href="javascript:;" class="look i18n" name="look">' + bind_info + '</a><span class="none idPhotoSrc bind_info">' + data[i].bind_info + '</span></td>' +
                        '<td><span>' + data[i].ctime + '</span></td>' +
                        '<td><button class="btn btn-success btn-sm passBtn i18n" name="pass">pass</button></td>' +
                        '<td><button class="btn btn-danger btn-sm refuseBtn i18n" name="refuse">refuse</button></td>' +
                        '</tr>';
                } else {
                    bind_info = data[i].bind_info;
                    tr += '<tr class="userKycItem">' +
                        '<td><span class="us_id">' + data[i].us_id + '</span></td>' +
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
            $('#userKyc').html(tr);
            execI18n();
        }
    }, function (response) {
        if (response.errcode == '404') {
            GetDataEmpty('userKyc', '6');
            return;
        }
        GetErrorCode(response.errcode);
        GetDataFail('userKyc', '6');
        return;
    });

    //确定审核通过
    $(document).on('click', '.passBtn', function () {
        var _this = $(this);
        var us_id = $(this).parents('.userKycItem').find('.us_id').text();
        var bind_name = $(this).parents('.userKycItem').find('.bind_name').text();
        var bind_info = $(this).parents('.userKycItem').find('.bind_info').text();
        var log_id = $(this).parents('.userKycItem').find('.log_id').text();

        ConfirmKycUser(token, us_id, bind_name, bind_info, log_id, function (response) {
            if (response.errcode == '0') {
                _this.closest('.userKycItem').remove();
                layer.msg('<span class="i18n" name="successfulProcessing"></span>');
                execI18n();
            }
        }, function (response) {
            layer.msg('<span class="i18n" name="processingFailure"></span>');
            execI18n();
            GetErrorCode(response.errcode);
        })
    });

    //拒绝审核
    $(document).on('click', '.refuseBtn', function () {
        var _this = $(this);
        var log_id = $(this).parents('.userKycItem').find('.log_id').text();

        RefuseKycUser(token, log_id, function (response) {
            if (response.errcode == '0') {
                _this.closest('.userKycItem').remove();
                layer.msg('<span class="i18n" name="successfulProcessing"></span>');
                execI18n();
            }
        }, function (response) {
            layer.msg('<span class="i18n" name="processingFailure"></span>');
            execI18n();
            GetErrorCode(response.errcode);
        })
    });

    //查看图片
    $(document).on('click', '.look', function () {
        var idPhotoSrc = $(this).parents('.userKycItem').find('.idPhotoSrc').text();
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