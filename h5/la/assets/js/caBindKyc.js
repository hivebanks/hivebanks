$(function () {
    //Get token
    var token = GetCookie('la_token');

    //Get the ca review list
    var api_url = 'kyc_ca_list.php', tr = '';
    KycList(api_url, token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, bind_name = '', bind_info = '', bind_type = '';
            if (data == false) {
                GetDataEmpty('caKyc', '5');
                return;
            }
            $.each(data, function (i, val) {
                if (data[i].bind_type == 'file' && data[i].bind_name == 'idPhoto') {
                    bind_type = "<td><span class='i18n' name='fileBind'></span></td>";
                    bind_name = "<td><span class='bind_name i18n' name='idPhoto'>" + data[i].bind_name + "</span></td>";
                    bind_info = "<td>" +
                        "<a href='javascript:;' class='look i18n' name='look'>" + bind_info + "</a>" +
                        "<span class='none idPhotoSrc bind_info'>" + data[i].bind_info + "</span>" +
                        "</td>"
                } else if (data[i].bind_type == 'text' && data[i].bind_name == 'idNum') {
                    bind_type = "<td><span class='i18n' name='textBind'></span></td>";
                    bind_name = "<td><span class='bind_name i18n' name='idNum'>" + data[i].bind_name + "</span></td>";
                    bind_info = "<td><a class='bind_info'>" + data[i].bind_info + "</a></td>"
                } else if (data[i].bind_type == 'text' && data[i].bind_name == 'name') {
                    bind_type = "<td><span class='i18n' name='textBind'></span></td>";
                    bind_name = "<td><span class='bind_name i18n' name='name'>" + data[i].bind_name + "</span></td>";
                    bind_info = "<td><a class='bind_info'>" + data[i].bind_info + "</a></td>"
                }
                tr += "<tr class='caKycItem'>" +
                    "<td><span class='ca_id'>" + data[i].ca_id + "</span></td>" +
                    "<td style='display: none'><span class='log_id'>" + data[i].log_id + "</span></td>" +
                    bind_type +
                    bind_name +
                    bind_info +
                    "<td><span>" + data[i].ctime + "</span></td>" +
                    "<td><button class='btn btn-success btn-sm passBtn i18n' name='pass'></button></td>" +
                    "<td><button class='btn btn-danger btn-sm refuseBtn i18n' name='refuse'></button></td>" +
                    "</tr>"
            });
            $('#caKyc').html(tr);
            execI18n();

        }
    }, function (response) {
        GetDataFail('caKyc', '5');
        LayerFun(response.errcode);
        return;
    });

    //Confirm the approval
    $(document).on('click', '.passBtn', function () {
        var _this = $(this), log_id = $(this).parents('.caKycItem').find('.log_id').text();
        $(".preloader-wrapper").addClass("active");
        ConfirmKycCa(token, log_id, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                _this.closest('.caKycItem').remove();
                LayerFun('successfulProcessing');
                return;
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            LayerFun('processingFailure');
            LayerFun(response.errcode);
            return;
        })
    });

    //Refuse to review
    $(document).on('click', '.refuseBtn', function () {
        var _this = $(this);
        var log_id = $(this).parents('.caKycItem').find('.log_id').text();
        $(".preloader-wrapper").addClass("active");
        RefuseKycCa(token, log_id, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                _this.closest('.caKycItem').remove();
                LayerFun('successfulProcessing');
                return;
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            LayerFun('processingFailure');
            LayerFun(response.errcode);
            return;
        })
    });

    //view image
    $(document).on('click', '.look', function () {
        var idPhotoSrc = $(this).parents('.caKycItem').find('.idPhotoSrc').text();
        var idPhotoSrcOne = idPhotoSrc.split(',')[0];
        var idPhotoSrcTwo = idPhotoSrc.split(',')[1];
        $('.idPhotoSrcOne').attr('src', idPhotoSrcOne);
        $('.idPhotoSrcTwo').attr('src', idPhotoSrcTwo);
        $('#lookImgModal').modal('open');
    });

    //Initialize modal
    $('#lookImgModal').modal({
        dismissible: true,
        opacity: .5,
        in_duration: 300,
        out_duration: 200,
    });
});