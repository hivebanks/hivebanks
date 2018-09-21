$(function () {
    //Get token
    var token = GetCookie('la_token');

    // Config url
    $('.setApiBtn').click(function () {
        var api_key = $('#api_key').val();
        if (api_key.length <= 0) {
            LayerFun('inputCannotBeEmpty');
            return;
        }
        $(".preloader-wrapper").addClass("active");
        SetApiKey(token, api_key, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                $('#api_key').val(' ');
                LayerFun('setSuccessfully');
                execI18n();
                $('.api_key_value').text(response.option_value);
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            LayerFun(response.errcode);
            LayerFun('updateFailed');
            execI18n();
            return;
        })
    });

    //Get la base information
    GetLaBaseInfo(token, function (response) {
        if (response.errcode == '0') {
            var data = response.row;
            $('.base_currency').text(data.base_currency);
            SetCookie('base_currency', data.base_currency);
            $('.unit').text(data.unit);
            $('.h5_url').text(data.h5_url);
            $('.api_url').text(data.api_url);
            $('.api_key_value').text(data.api_key);
        }
    }, function (response) {
        LayerFun(response.errcode);
        if (response.errcode == "114") {
            DelCookie("la_token");
            window.location.href = "login.html";
        }
        return;
    });

    //get key_code
    var key_code = "";
    GetKeyCode(token, function (response) {
        if (response.errcode == '0') {
            key_code = response.key_code;
            GetOpenServerFun(key_code);
        }
    }, function (response) {
        LayerFun(response.errcode);
    });

    //get open server
    function GetOpenServerFun(key_code) {
        var getOpenServerUrl = "http://agent_service.fnying.com/action/get_common_config.php",
            getOpenServerData = {"key_code": key_code};
        $.get(getOpenServerUrl, getOpenServerData, function (response) {
            if(response.errcode == "0"){
                var data = response.rows[0];
                if(data.email_service == "1" && data.flag == "1"){
                    $(".noOpenEmail").remove();
                    $(".alreadyOpenEmail").removeClass("none");
                    $(".iconEmail").removeClass("color-red").addClass("color-green");
                    $(".iconEmail").removeClass("icon-gantanhao").addClass("icon-duihao");
                    $(".radioEmail").attr("disabled", true);
                }
                if(data.sms_service == "1" && data.flag == "1"){
                    $(".noOpenSms").remove();
                    $(".alreadyOpenSms").removeClass("none");
                    $(".iconSms").removeClass("color-red").addClass("color-green");
                    $(".iconSms").removeClass("icon-gantanhao").addClass("icon-duihao");
                    $(".radioSms").attr("disabled", true);
                }
                if(data.upload_file_service == "1" && data.flag == "1"){
                    $(".noOpenFile").remove();
                    $(".alreadyOpenFile").removeClass("none");
                    $(".iconFile").removeClass("color-red").addClass("color-green");
                    $(".iconFile").removeClass("icon-gantanhao").addClass("icon-duihao");
                    $(".radioFile").attr("disabled", true);
                }
                if(data.email_service == "1" && data.sms_service == "1" &&
                    data.upload_file_service == "1" && data.flag == "1"){
                    $(".configServeBtn").remove();
                }
            }
        }, "jsonp");
    }

    //select input
    $("input[type='radio']").change(function () {
        $(this).parent().siblings().removeClass("none");
        $(this).parents(".configServerItem").siblings().find(".keyBox").addClass("none");
    });

    //set config serve
    $('.configServeBtn').click(function () {
        var type = $("input[type='radio']:checked").val(), url = '';
        var key_code = $("input[type='radio']:checked").parent().siblings().children("input[type='text']").val();
        if (type == false) {
            LayerFun("pleaseSelectOpenServer");
            return;
        }
        if (key_code.length <= 0) {
            LayerFun("pleaseInputKey");
            return;
        }

        if (type == '1') {
            OpenUploadFile(token, key_code, function (response) {
                if (response.errcode == "0") {
                    $('.noOpenFile').fadeOut();
                    $('.alreadyOpenFile').fadeIn();
                    $(".radioFile").attr("disabled", true);
                }
            }, function (response) {
                layer.msg(response.errmsg);
            });
        }
        if (type == '2') {
            OpenSms(token, key_code, function (response) {
                if (response.errcode == "0") {
                    $('.noOpenSms').fadeOut();
                    $('.alreadyOpenSms').fadeIn();
                    $(".radioSms").attr("disabled", true);
                }
            }, function (response) {
                layer.msg(response.errmsg);
            });
        }
        if (type == '3') {
            OpenEmail(token, key_code, function (response) {
                if (response.errcode == "0") {
                    $('.noOpenEmail').fadeOut();
                    $('.alreadyOpenEmail').fadeIn();
                    $(".radioEmail").attr("disabled", true);
                }
            }, function (response) {
                layer.msg(response.errmsg);
            });
        }
    });

    //Get registration permission display
    function optionName(option_name, _switch) {
        if (_switch == '1') {
            $('.' + option_name + '_on').css('color', '#26a69a');
            $('.' + option_name + '_input').prop('checked', true);
            $('.' + option_name + '_text').text($('.' + option_name + '_on').text());
        } else {
            $('.' + option_name + '_off').css('color', '#26a69a');
            $('.' + option_name + '_input').prop('checked', false);
            $('.' + option_name + '_text').text($('.' + option_name + '_off').text());
        }

    }

    //Get us/ba/ca registration permission
    GetSwitch(token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, _switch = '';
            $.each(data, function (i, val) {
                if (data[i].option_name == 'ba_lock' && data[i].is_open == '1') {
                    _switch = '1';
                    optionName(data[i].option_name, _switch);
                } else if (data[i].option_name == 'ba_lock' && data[i].is_open == '0') {
                    _switch = '0';
                    optionName(data[i].option_name, _switch);
                }

                if (data[i].option_name == 'ca_lock' && data[i].is_open == '1') {
                    _switch = '1';
                    optionName(data[i].option_name, _switch);
                } else if (data[i].option_name == 'ca_lock' && data[i].is_open == '0') {
                    _switch = '0';
                    optionName(data[i].option_name, _switch);
                }

                if (data[i].option_name == 'user_lock' && data[i].is_open == '1') {
                    _switch = '1';
                    optionName(data[i].option_name, _switch);
                } else if (data[i].option_name == 'user_lock' && data[i].is_open == '0') {
                    _switch = '0';
                    optionName(data[i].option_name, _switch);
                }
            });
        }
    }, function (response) {
        if (response.errcode == "114") {
            DelCookie("la_token");
            window.location.href = "login.html";
        }
    });

    //ba/ca/us Registration permission opened successfully (closed failure) function
    function SetSwitchStyleSuc(_this) {
        _this.prop('checked', true);
        _this.siblings('.setOn').css('color', '#26a69a');
        _this.siblings('.setOff').css('color', '#9e9e9e');
        _this.parents('.switchBox').find('.setType').text(_this.siblings('.setOn').text());
    }

    //ba/ca/us Registration permission failed to open (closed successfully) function
    function SetSwitchStyleFail(_this) {
        _this.prop('checked', false);
        _this.siblings('.setOff').css('color', '#26a69a');
        _this.siblings('.setOn').css('color', '#9e9e9e');
        _this.parents('.switchBox').find('.setType').text(_this.siblings('.setOff').text());
    }

    //Set us/ba/ca registration permission
    function SetSwitchFun(type, status, _this, typeSwitch) {
        SetSwitch(token, type, status, function (response) {
            if (response.errcode == '0') {
                LayerFun('setSuccessfully');
                if (typeSwitch == 'on') {
                    SetSwitchStyleSuc(_this);
                    return;
                }
                if (typeSwitch == 'off') {
                    SetSwitchStyleFail(_this);
                    return;
                }
            }
        }, function (response) {
            LayerFun('setupFailed');
            if (typeSwitch == 'on') {
                SetSwitchStyleFail(_this);
                return;
            }
            if (typeSwitch == 'off') {
                SetSwitchStyleSuc(_this);
                return;
            }
            LayerFun(response.errcode);
            return;
        });
    }

    //Set to allow ba registration
    $('.bitRegister').change(function () {
        var _this = $(this), type = '', status = '', typeSwitch = '';
        if ($(this).is(':checked') == true) {
            type = 'ba';
            status = 1;
            typeSwitch = 'on';
            SetSwitchFun(type, status, _this, typeSwitch);
        } else {
            type = 'ba';
            status = 0;
            typeSwitch = 'off';
            SetSwitchFun(type, status, _this, typeSwitch);
        }
    });

    //Set to allow ca registration
    $('.cashRegister').change(function () {
        var _this = $(this), type = '', status = '', typeSwitch = '';
        if ($(this).is(':checked') == true) {
            type = 'ca';
            status = 1;
            typeSwitch = 'on';
            SetSwitchFun(type, status, _this, typeSwitch);
        } else {
            type = 'ca';
            status = 0;
            typeSwitch = 'off';
            SetSwitchFun(type, status, _this, typeSwitch);
        }
    });

    //Set to allow user registration
    $('.userRegister').change(function () {
        var _this = $(this), type = '', status = '', typeSwitch = '';
        if ($(this).is(':checked') == true) {
            type = 'us';
            status = 1;
            typeSwitch = 'on';
            SetSwitchFun(type, status, _this, typeSwitch);
        } else {
            type = 'us';
            status = 0;
            typeSwitch = 'off';
            SetSwitchFun(type, status, _this, typeSwitch);
        }
    });

    //Setup administrator
    $('.permissionBtn').click(function () {
        var pinList = '', checkedArr = $("input[type='checkbox']:checked");
        $.each(checkedArr, function (i, val) {
            pinList += $(this).next('label').text() + ',';
        });
        var length = pinList.length - 1, pid = pinList.substring(0, length);
        var real_name = $('#name').val(), pass_word_hash = hex_sha1($('#password').val()), user = $('#userName').val();
        $(".preloader-wrapper").addClass("active");
        SetPermission(token, pid, real_name, pass_word_hash, user, function (response) {
            if (response.errcode == '0') {
                $(".preloader-wrapper").removeClass("active");
                LayerFun('setSuccessfully');
                return;
            }
        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            LayerFun('setupFailed');
            LayerFun(response.errcode);
            return;
        })
    });

    //Get the BA proxy type that has been set
    function GetBaTypeFun() {
        var api_url = 'get_ba_bit_type.php', li = '';
        GetAgentType(api_url, token, function (response) {
            if (response.errcode == '0') {
                var data = response.rows;
                if (data.length <= 0) {
                    return;
                }
                $.each(data, function (i, val) {
                    li += '<li class="ba_bit_type">' +
                        '<span class="option_key">' + data[i].option_key + '</span>' +
                        '<span class="fa fa-times"></span>' +
                        '</li>';
                });
                $('.alreadyAddBaTypeBox').html(li);
            }
        }, function (response) {
            LayerFun(response.errcode);
            if (response.errcode == "114") {
                DelCookie("la_token");
                window.location.href = "login.html";
            }
            return;
        });
    }

    GetBaTypeFun();

    //Select Ba proxy type
    $('.baseBaTypeBox li').click(function () {
        var liVal = $(this).text();
        $('.baseBaTypeInput').val(liVal);
        $(this).addClass('baseLiActive').siblings().removeClass('baseLiActive');
    });

    //Set the BA proxy type
    var option_key = '', option_value = '', option_src = '';
    $('.baseBaTypeBtn').click(function () {
        option_key = $('.baseBaTypeInput').val();
        option_value = $('.baseBaTypeInput').val();
        if (option_key.length <= 0) {
            LayerFun('pleaseSelectOrManuallyEnterTheAllowedDigitalCurrencyProxyType');
            return;
        }
        $('#uploadImgModal').modal('open');
        $('.baseBaTypeBtnConfirm').removeClass('ca');
    });

    //Delete BA proxy type
    $(document).on('click', ' .ba_bit_type', function () {
        var _this = $(this);
        var api_url = 'del_ba_bit_type.php';
        var option_key = $(this).children('.option_key').text();
        DeleteAgentType(api_url, token, option_key, function (response) {
            if (response.errcode == '0') {
                _this.remove();
                LayerFun('successfullyDeleted');
                return;
            }
        }, function (response) {
            LayerFun('failedToDelete');
            return;
            LayerFun(response.errcode);
            return;
        })
    });

    //Get the CA proxy type that has been set
    function GetCaTypeFun() {
        var api_url = 'get_ca_channel.php', li = '';
        GetAgentType(api_url, token, function (response) {
            if (response.errcode == '0') {
                var data = response.rows;
                if (data.length <= 0) {
                    return;
                }
                $.each(data, function (i, val) {
                    li += '<li class="ca_bit_type">' +
                        '<span class="option_key">' + data[i].option_key + '</span>' +
                        '<span class="fa fa-times"></span>' +
                        '</li>';
                });
                $('.alreadyAddCaTypeBox').html(li);
            }
        }, function (response) {
            LayerFun(response.errcode);
            if (response.errcode == "114") {
                DelCookie("la_token");
                window.location.href = "login.html";
            }
        });
    }

    GetCaTypeFun();

    //Select CA proxy type
    $('.baseCaTypeBox li').click(function () {
        var liVal = $(this).text(), name = $(this).attr('title');
        $('.baseCaTypeInput').val(liVal);
        $('.baseCaTypeInput').attr('name', name);
        $(this).addClass('baseLiActive').siblings().removeClass('baseLiActive');
    });

    //Set the CA proxy type
    $('.baseCaTypeBtn').click(function () {
        option_key = $('.baseCaTypeInput').val();
        option_value = $('.baseCaTypeInput').val();
        if (option_key.length <= 0) {
            LayerFun('pleaseSelectOrManuallyEnterTheAllowedDigitalCurrencyProxyType');
            return;
        }
        $('#uploadImgModal').modal('open');
        $('.baseBaTypeBtnConfirm').addClass('ca');
    });

    //Delete the CA proxy type
    $(document).on('click', '.alreadyAddCaTypeBox .ca_bit_type', function () {
        var _this = $(this);
        var api_url = 'del_ca_channel.php';
        var option_key = $(this).children('.option_key').text();
        DeleteAgentType(api_url, token, option_key, function (response) {
            if (response.errcode == '0') {
                _this.remove();
                LayerFun('successfullyDeleted');
                return;
            }
        }, function (response) {
            LayerFun('failedToDelete');
            return;
            LayerFun(response.errcode);
        })
    });

    //Upload image to determine BA/CA
    $('.baseBaTypeBtnConfirm').click(function () {
        var api_url = '';
        if (option_src == '') {
            LayerFun('pleaseUploadAnImageOfTheSelectedType');
            return;
        }
        if ($(this).hasClass('ca')) {
            api_url = 'set_ca_channel.php';
            SetAgentType(api_url, token, option_key, option_value, option_src, function (response) {
                if (response.errcode == '0') {
                    $('#uploadImgModal').modal('close');
                    LayerFun('setSuccessfully');
                    GetCaTypeFun();
                }
            }, function (response) {
                LayerFun('setupFailed');
                LayerFun(response.errcode);
            })
        } else {
            api_url = 'set_ba_bit_type.php';
            SetAgentType(api_url, token, option_key, option_value, option_src, function (response) {
                if (response.errcode == '0') {
                    $('#uploadImgModal').modal('close');
                    LayerFun('setSuccessfully');
                    GetBaTypeFun();
                }
            }, function (response) {
                LayerFun('setupFailed');
                LayerFun(response.errcode);
            })
        }
    });

    //Upload image cancel
    $('.uploadImgRow .cancel').click(function () {
        $('#uploadImgModal').modal('close');
    });

    //Upload image
    $('#uploadFile').on('change', function () {
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // Modify the address attribute of the picture here
            $(".uploadImgSrc").attr("src", objUrl);
        }

        var formData = new FormData($("#uploadForm")[0]);
        formData.append("key_code", key_code);
        option_src = UpLoadImg(formData);
    });

    //Select an image to display
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
                if (data.errcode == "1") {
                    layer.msg('<span class="i18n" name="notOpenUpload"></span>');
                    execI18n();
                    return;
                }
            },
            error: function (response) {
                layer.msg(response.msg);
            }
        });
        return src;
    }

    //init modal
    $('#uploadImgModal').modal({
        dismissible: true,
        opacity: .5,
        in_duration: 300,
        out_duration: 200,
    });
});