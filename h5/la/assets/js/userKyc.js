$(function () {
    //get token
    var token = GetCookie('la_token');

    var api_url = 'kyc_user_list.php', tr = '';
    KycList(api_url, token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, bind_info = '', bind_type = '', bind_name = '';
            $.each(data, function (i, val) {
                if (data[i].bind_type == 'file' && data[i].bind_name == 'idPhoto') {
                    bind_type = "<td><span class='i18n' name='fileBind'></span></td>";
                    bind_name = "<td><span class='i18n' name='idPhoto'>" + data[i].bind_name + "</span></td>";
                    bind_info = "<td>" +
                        "<a href='javascript:;' class='look i18n' name='look'>" + bind_info + "</a>" +
                        "<span class='none idPhotoSrc bind_info'>" + data[i].bind_info + "</span>" +
                        "</td>"
                } else if (data[i].bind_type == 'text' && data[i].bind_name == 'idNum') {
                    bind_type = "<td><span class='i18n' name='textBind'></span></td>";
                    bind_name = "<td><span class='i18n' name='idNum'>" + data[i].bind_name + "</span></td>";
                    bind_info = "<td><a class='bind_info'>" + data[i].bind_info + "</a></td>"
                }else if (data[i].bind_type == 'text' && data[i].bind_name == 'name') {
                    bind_type = "<td><span class='i18n' name='textBind'></span></td>";
                    bind_name = "<td><span class='i18n' name='name'>" + data[i].bind_name + "</span></td>";
                    bind_info = "<td><a class='bind_info'>" + data[i].bind_info + "</a></td>"
                }
                tr += "<tr class='userKycItem'>" +
                    "<td><span class='us_id'>" + data[i].us_id + "</span></td>" +
                    "<td style='display: none'>" +
                    "<span class='bind_name' name="+ data[i].bind_name +"></span>" +
                    "<span class='log_id' name="+ data[i].log_id +"></span>" +
                    "</td>" +
                    bind_type +
                    bind_name +
                    bind_info +
                    "<td><span>" + data[i].ctime + "</span></td>" +
                    "<td><button class='btn btn-success btn-sm passBtn i18n' name='pass'></button></td>" +
                    "<td><button class='btn btn-danger btn-sm refuseBtn i18n' name='refuse'></button></td>" +
                    "</tr>"
            });
            $('#userKyc').html(tr);
            execI18n();
        }
    }, function (response) {
        if (response.errcode == '404') {
            GetDataEmpty('userKyc', '6');
            return;
        }
        LayerFun(response.errcode);
        GetDataFail('userKyc', '6');
        return;
    });

    //Confirm the approval
    $(document).on('click', '.passBtn', function () {
        var _this = $(this);
        var us_id = $(this).parents('.userKycItem').find('.us_id').text();
        var bind_name = $(this).parents('.userKycItem').find('.bind_name').attr("name");
        var bind_info = $(this).parents('.userKycItem').find('.bind_info').text();
        var log_id = $(this).parents('.userKycItem').find('.log_id').attr("name");
        $(".preloader-wrapper").addClass("active");
        ConfirmKycUser(token, us_id, bind_name, bind_info, log_id, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                _this.closest('.userKycItem').remove();
                layer.msg('<span class="i18n" name="successfulProcessing"></span>');
                execI18n();
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            layer.msg('<span class="i18n" name="processingFailure"></span>');
            execI18n();
            LayerFun(response.errcode);
        })
    });

    //refuse
    $(document).on('click', '.refuseBtn', function () {
        var _this = $(this);
        var log_id = $(this).parents('.userKycItem').find('.log_id').attr("name");
        $(".preloader-wrapper").addClass("active");
        RefuseKycUser(token, log_id, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                _this.closest('.userKycItem').remove();
                layer.msg('<span class="i18n" name="successfulProcessing"></span>');
                execI18n();
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            layer.msg('<span class="i18n" name="processingFailure"></span>');
            execI18n();
            LayerFun(response.errcode);
        })
    });

    //view image
    $(document).on('click', '.look', function () {
        var idPhotoSrc = $(this).parents('.userKycItem').find('.idPhotoSrc').text();
        var idPhotoSrcOne = idPhotoSrc.split(',')[0];
        var idPhotoSrcTwo = idPhotoSrc.split(',')[1];
        $('.idPhotoSrcOne').attr('src', idPhotoSrcOne);
        $('.idPhotoSrcTwo').attr('src', idPhotoSrcTwo);
        $('#lookImgModal').modal('open');
    });

    //init modal
    $('#lookImgModal').modal({
        dismissible: true,
        opacity: .5,
        in_duration: 300,
        out_duration: 200,
    });
});