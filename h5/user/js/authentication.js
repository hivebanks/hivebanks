$(function () {
    //token
    var token = GetCookie('user_token');
    var id = getCookie('us_id');
    GetUsAccount();

    //Get binding information, whether to bind
    var name = '', idNum = '', idPhoto = '';

    function GetBindInfo() {
        BindingInformation(token, function (response) {
            if (response.errcode == '0') {
                var data = response.rows;
                //count_error==0review 1rejection
                $.each(data, function (i, val) {

                    //bind name
                    if (data[i].bind_name == 'name' && data[i].bind_flag == '1') {//Name binding succeeded
                        name = data[i].bind_name;
                        $('.nameBindNot').text(data[i].bind_info).show();
                        $('.nameFormBox').remove();
                        $('.nameBindBtn').remove();
                        $('.nameUnderReview').remove();
                        $('.nameBindRefuse').remove();
                        $('.nameBindAlready').show('fast');
                        $('.nameIcon').addClass('greenIcon icon-duihao').removeClass('icon-gantanhao');
                        return;
                    } else if (data[i].bind_name == 'name' && data[i].count_error == '0') {//Name review
                        name = data[i].bind_name;
                        $('.nameFormBox').remove();
                        $('.nameBindBtn').remove();
                        $('.nameBindNot').remove();
                        $('.nameBindAlready').remove();
                        $('.nameBindRefuse').remove();
                        $('.nameUnderReview').show('fast');
                        $('.nameIcon').css('color', '#9e9e9e');
                        return;
                    } else if (data[i].bind_name == 'name' && data[i].count_error == '1') {//Name review rejection
                        $('.nameBindNot').remove();
                        $('.nameBindAlready').remove();
                        $('.nameUnderReview').remove();
                        $('.nameBindBtn').show();
                        $('.nameBindRefuse').show();
                        return;
                    }

                    //Bind ID number
                    if (data[i].bind_name == 'idNum' && data[i].bind_flag == '1') {//ID card number binding success
                        idNum = data[i].bind_name;
                        $('.idNumBindNot').text(data[i].bind_info).show();
                        $('.idNumFormBox').remove();
                        $('.idNumBindBtn').remove();
                        $('.idNumUnderReview').remove();
                        $('.idNumBindRefuse').remove();
                        $('.idNumBindAlready').show('fast');
                        $('.idNumIcon').addClass('greenIcon icon-duihao').removeClass('icon-gantanhao');
                        return;
                    } else if (data[i].bind_name == 'idNum' && data[i].count_error == '0') {//ID card number review
                        idNum = data[i].bind_name;
                        $('.idNumFormBox').remove();
                        $('.idNumBindBtn').remove();
                        $('.idNumBindNot').remove();
                        $('.idNumBindRefuse').remove();
                        $('.idNumBindAlready').remove();
                        $('.idNumUnderReview').show('fast');
                        $('.idNumIcon').css('color', '#9e9e9e');
                        return;
                    } else if (data[i].bind_name == 'idNum' && data[i].count_error == '1') {//ID card number review rejection
                        $('.idNumBindNot').remove();
                        $('.idNumBindAlready').remove();
                        $('.idNumUnderReview').remove();
                        $('.idNumBindBtn').show();
                        $('.idNumBindRefuse').show();
                        return;
                    }

                    //Upload ID card
                    if (data[i].bind_name == 'idPhoto' && data[i].bind_flag == '1') {//Successful ID card upload
                        idPhoto = data[i].bind_name;
                        $('.uploadBindNot').remove();
                        $('.idPhotoFormBox').remove();
                        $('.idPhotoBindBtn').remove();
                        $('.uploadUnderReview').remove();
                        $('.uploadBindRefuse').remove();
                        $('.uploadBindAlready').show('fast');
                        $('.idPhotoIcon').addClass('greenIcon icon-duihao').removeClass('icon-gantanhao');
                        return;
                    } else if (data[i].bind_name == 'idPhoto' && data[i].count_error == '0') {//Upload ID card review
                        idPhoto = data[i].bind_name;
                        $('.idPhotoFormBox').remove();
                        $('.idPhotoBindBtn').remove();
                        $('.uploadBindNot').remove();
                        $('.uploadBindRefuse').remove();
                        $('.uploadBindAlready').remove();
                        $('.uploadUnderReview').show('fast');
                        $('.idPhotoIcon').css('color', '#9e9e9e');
                        return;
                    } else if (data[i].bind_name == 'idPhoto' && data[i].count_error == '1') {//Upload ID card review rejection
                        $('.idNumBindNot').remove();
                        $('.idNumBindAlready').remove();
                        $('.idNumUnderReview').remove();
                        return;
                    }
                });
            }
        }, function (response) {
            LayerFun(response.errcode);
        });
    }

    GetBindInfo();

    //show bind name
    $('.nameBindBtn').click(function () {
        $('.nameFormBox').fadeToggle('fast');
    });
    //bind name
    $('.nameBindEnable').click(function () {
        var text_type = '3',
            text = $('#name').val(),
            text_hash = hex_sha1(text);

        if (text == '') {
            LayerFun('pleaseEnterName');
            return;
        }
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        ShowLoading("show");
        TextBind(token, text_type, text, text_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                $('#name').val(' ');
                LayerFun('submitSuccess');
                GetBindInfo();
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
        })
    });

    //show ID card number binding
    $('.idNumBindBtn').click(function () {
        if (name != 'name') {
            LayerFun('firstBindName');
            return;
        }
        $('.idNumFormBox').fadeToggle('fast');
    });

    //Bind ID number
    $('.idNumBindEnable').click(function () {
        var text_type = '2',
            text = $('#idNum').val(),
            text_hash = hex_sha1(text);

        if (text == '') {
            LayerFun('pleaseEnterIdNumber');
            return;
        }
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        ShowLoading("show");
        TextBind(token, text_type, text, text_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                $('#idNum').val(' ');
                LayerFun('submitSuccess');
                GetBindInfo();
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
        })
    });


    //show ID upload binding
    $('.idPhotoBindBtn').click(function () {
        if (name != 'name') {
            LayerFun('firstBindName');
            return;
        }
        if (idNum != 'idNum') {
            LayerFun('firstIdNum');
            return;
        }

        $('.idPhotoFormBox').fadeToggle('fast');
    });

    //Return image information
    function UpLoadImg(formData) {
        var src = '';
        $.ajax({
            url: 'http://agent_service.fnying.com/upload_file/upload.php',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                var data = JSON.parse(response);
                if (data.errcode == '0') {
                    src = data.url;
                }
            },
            error: function (response) {
                layer.msg(response.msg);
            }
        });
        return src;
    }

    //get key_code
    var key_code = "";
    GetKeyCode(token, function (response) {
        if (response.errcode == '0') {
            key_code = response.key_code;
        }
    }, function (response) {
        LayerFun(response.errcode);
    });

    /** Upload picture - front
     *Get the selection file
     * ID card upload verification
     */
    var src1 = '', src2 = '';
    $('#file0').on('change', function () {
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // show img
            $("#idPositive").attr("src", objUrl);
        }

        var formData = new FormData($("#form0")[0]);
        formData.append("key_code", key_code);
        src1 = UpLoadImg(formData);
    });
    //Upload back
    $('#file1').on('change', function () {
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // show img
            $("#idNegative").attr("src", objUrl);
        }
        var formData = new FormData($("#form1")[0]);
        formData.append("key_code", key_code);
        src2 = UpLoadImg(formData);
    });

    // ID card upload verification
    $('#submit').click(function () {
        var file_type = 'idPhoto',
            file_url = src1 + ',' + src2;
        //bind file
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        ShowLoading("show");
        FileBind(token, file_type, file_url, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                LayerFun('submitSuccess');
                GetBindInfo();
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
        })
    });

    //Display when selecting a picture
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