$(function () {
    //获取用户token
    var token = GetCookie('ca_token');
    GetCaAccount();

    //获取绑定信息，是否绑定
    var name = '', idNum = '', idPhoto = '', id = '';
    function GetBindInfo(){
        GetCaBindInformation(token, function (response) {
            if (response.errcode == '0') {
                var data = response.rows;
                id = response.security_level.ca_id;
                //count_error==0审核中 1拒绝
                $.each(data, function (i, val) {

                    //姓名绑定
                    if (data[i].bind_name == 'name' && data[i].bind_flag == '1') {//姓名绑定成功
                        name = data[i].bind_name;
                        $('.nameBindNot').text(data[i].bind_info).show();
                        $('.nameFormBox').remove();
                        $('.nameBindBtn').remove();
                        $('.nameUnderReview').remove();
                        $('.nameBindRefuse').remove();
                        $('.nameBindAlready').show('fast');
                        $('.nameIcon').addClass('greenIcon icon-duihao').removeClass('icon-gantanhao');
                        return;
                    }else if(data[i].bind_name == 'name' && data[i].count_error == '0'){//姓名审核中
                        name = data[i].bind_name;
                        $('.nameFormBox').remove();
                        $('.nameBindBtn').remove();
                        $('.nameBindNot').remove();
                        $('.nameBindAlready').remove();
                        $('.nameBindRefuse').remove();
                        $('.nameUnderReview').show('fast');
                        $('.nameIcon').css('color','#9e9e9e');
                        return;
                    }else if(data[i].bind_name == 'name' && data[i].count_error == '1'){//姓名审核拒绝
                        $('.nameBindNot').remove();
                        $('.nameBindAlready').remove();
                        $('.nameUnderReview').remove();
                        $('.nameBindBtn').show();
                        $('.nameBindRefuse').show();
                        return;
                    }

                    //绑定身份证号码
                    if (data[i].bind_name == 'idNum' && data[i].bind_flag == '1') {//身份证号码绑定成功
                        idNum = data[i].bind_name;
                        $('.idNumBindNot').text(data[i].bind_info).show();
                        $('.idNumFormBox').remove();
                        $('.idNumBindBtn').remove();
                        $('.idNumUnderReview').remove();
                        $('.idNumBindRefuse').remove();
                        $('.idNumBindAlready').show('fast');
                        $('.idNumIcon').addClass('greenIcon icon-duihao').removeClass('icon-gantanhao');
                        return;
                    }else if(data[i].bind_name == 'idNum' && data[i].count_error == '0'){//身份证号码审核中
                        idNum = data[i].bind_name;
                        $('.idNumFormBox').remove();
                        $('.idNumBindBtn').remove();
                        $('.idNumBindNot').remove();
                        $('.idNumBindRefuse').remove();
                        $('.idNumBindAlready').remove();
                        $('.idNumUnderReview').show('fast');
                        $('.idNumIcon').css('color','#9e9e9e');
                        return;
                    }else if(data[i].bind_name == 'idNum' && data[i].count_error == '1'){//身份证号码审核拒绝
                        $('.idNumBindNot').remove();
                        $('.idNumBindAlready').remove();
                        $('.idNumUnderReview').remove();
                        $('.idNumBindBtn').show();
                        $('.idNumBindRefuse').show();
                        return;
                    }

                    //上传身份证
                    if (data[i].bind_name == 'idPhoto' && data[i].bind_flag == '1') {//身份证上传成功
                        idPhoto = data[i].bind_name;
                        $('.uploadBindNot').text('身份证已上传').show();
                        $('.idPhotoFormBox').remove();
                        $('.idPhotoBindBtn').remove();
                        $('.uploadUnderReview').remove();
                        $('.uploadBindRefuse').remove();
                        $('.uploadBindAlready').show('fast');
                        $('.idPhotoIcon').addClass('greenIcon icon-duihao').removeClass('icon-gantanhao');
                        return;
                    }else if(data[i].bind_name == 'idPhoto' && data[i].count_error == '0'){//上传身份证审核中
                        idPhoto = data[i].bind_name;
                        $('.idPhotoFormBox').remove();
                        $('.idPhotoBindBtn').remove();
                        $('.uploadBindNot').remove();
                        $('.uploadBindRefuse').remove();
                        $('.uploadBindAlready').remove();
                        $('.uploadUnderReview').show('fast');
                        $('.idPhotoIcon').css('color','#9e9e9e');
                        return;
                    }else if(data[i].bind_name == 'idPhoto' && data[i].count_error == '1'){//上传身份证审核拒绝
                        $('.idNumBindNot').remove();
                        $('.idNumBindAlready').remove();
                        $('.idNumUnderReview').remove();
                        return;
                    }
                });
            }
        }, function (response) {
            GetErrorCode(response.errcode);
        });
    }
    GetBindInfo();

    //显示姓名绑定
    $('.nameBindBtn').click(function () {
        $('.nameFormBox').fadeToggle('fast');
    });
    //姓名绑定
    $('.nameBindEnable').click(function () {
        var text_type = '3',
            text = $('#name').val(),
            text_hash = hex_sha1(text);
        if (text == '') {
            LayerFun('pleaseEnterName');
            return;
        }
        TextBind(token, text_type, text, text_hash, function (response) {
            if (response.errcode == '0') {
                $('#name').val(' ');
                LayerFun('submitSuccess');
                GetBindInfo();
            }
        }, function (response) {
            GetErrorCode(response.errcode);
        })
    });

    //显示身份证号码绑定
    $('.idNumBindBtn').click(function () {
        if(name != 'name'){
            LayerFun('bindNameFirst');
            return;
        }
        $('.idNumFormBox').fadeToggle('fast');
    });

    //绑定身份证号码
    $('.idNumBindEnable').click(function () {
        var text_type = '2',
            text = $('#idNum').val(),
            text_hash = hex_sha1(text);

        if (text == '') {
            LayerFun('pleaseEnterIdNumber');
            return;
        }

        TextBind(token, text_type, text, text_hash, function (response) {
            if (response.errcode == '0') {
                $('#idNum').val(' ');
                LayerFun('submitSuccess');
                GetBindInfo();
            }
        }, function (response) {
            GetErrorCode(response.errcode);
        })
    });


    //显示身份证上传绑定
    $('.idPhotoBindBtn').click(function () {
        if(name != 'name'){
            LayerFun('bindNameFirst');
            return;
        }
        if(idNum != 'idNum'){
            LayerFun('bindIdFirst');
            return;
        }

        $('.idPhotoFormBox').fadeToggle('fast');
    });

    //身份证上传绑定
    //获取配置文件
    var url = getRootPath();
    var config_api_url = '';
    $.ajax({
        url: url+"/assets/json/config_url.json",
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            config_api_url = data.api_url;
            config_h5_url = data.h5_url;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
    //返回图片信息
    function UpLoadImg(formData) {
        var objData = new Object();
        $.ajax({
            url: 'http://agent_service.fnying.com/upload_file/upload.php',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                console.log(response);
                // var data = JSON.parse(response);
                // if(data.code == '-1'){
                //     LayerFun('fileUploadFail');
                //     return;
                // }
                // if(data.errcode == '1'){
                //     LayerFun("notOpenFileUpload");
                //     return;
                // }
                // objData.src = data.data.src;
                // objData.file_hash = data.file_hash;
            },
            error: function (response) {
                console.log(response);
                layer.msg(response.msg);
            }
        });
        return objData;
    }

    //get la_id
    var la_id = "";
    GetLaId(token, function (response) {
        if(response.errcode == '0'){
            la_id = response.la_id;
        }
    }, function (response) {
        GetErrorCode(response.errcode);
    });
    /** 上传图片-正面
     *获取选择文件
     * 身份证上传验证
     */
    var fileObj0 = '', fileObj1 = '';
    $('#file0').on('change', function () {
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // 在这里修改图片的地址属性
            $("#idPositive").attr("src", objUrl);
        }

        var formData = new FormData($("#form0")[0]);
        formData.append("la_id", la_id);
        formData.append("id", id);
        fileObj0 = UpLoadImg(formData);
        console.log(fileObj0);
    });
    //上传背面
    $('#file1').on('change', function () {
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // 在这里修改图片的地址属性
            $("#idNegative").attr("src", objUrl);
        }
        var formData = new FormData($("#form1")[0]);
        formData.append("la_id", la_id);
        formData.append("id", id);
        fileObj1 = UpLoadImg(formData);
    });

    // 身份证上传验证
    $('#submit').click(function () {
        var file_type = 'idPhoto',
            file_url = fileObj0.src + ',' + fileObj1.src,
            file_hash = fileObj0.file_hash + ',' + fileObj1.file_hash;
        if (file_hash == 'undefined,undefined' || file_url == 'undefined,undefined') {
            LayerFun('bindFail');
            return;
        }
        //调用文件绑定
        FileBind(token, file_type, file_url, file_hash, function (response) {
            if (response.errcode == '0') {
                LayerFun('submitSuccess');
                GetBindInfo();
            }

        }, function (response) {
            GetErrorCode(response.errcode);
        })
    });

    //选择图片进行显示
    function getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

});