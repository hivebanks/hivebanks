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
        SetApiKey(token, api_key, function (response) {
            if (response.errcode == '0') {
                $('#api_key').val(' ');
                LayerFun('setSuccessfully');
                execI18n();
                $('.api_key_value').text(response.option_value);
            }
        }, function (response) {
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
        return;
    });

    //get la_id
    var la_id = '';
    GetLaId(token, function (response) {
        if (response.errcode == '0') {
            la_id = response.la_id;
            //get config server
            var data = {"la_id" : response.la_id}, url = "http://agent_service.fnying.com/upload_file/get_config_service.php";
            $.post(url, data, function (_response) {
                if(_response.errcode == '0'){
                    var data = _response.rows;
                    if(data == false){
                        return;
                    }
                    $.each(data, function (i, val) {
                        if(data[i].type == '1' && data[i].status == '1'){
                            $('.radioFile').attr("disabled", true);
                            $('.noOpenFile, .underReviewFile').remove();
                            $('.alreadyOpenFile').show();
                            $('.iconFile').removeClass("icon-gantanhao color-red").addClass("icon-duihao color-green");
                        }else if(data[i].type == '1' && data[i].status == '0'){
                            $('.radioFile').attr("disabled", true);
                            $('.noOpenFile, .alreadyOpenFile').remove();
                            $('.underReviewFile').show();
                        }
                        if(data[i].type == '2' && data[i].status == '1'){
                            $('.radioSms').attr("disabled", true);
                            $('.noOpenSms, .underReviewSms').remove();
                            $('.alreadyOpenSms').show();
                            $('.iconSms').removeClass("icon-gantanhao color-red").addClass("icon-duihao color-green");
                        }else if(data[i].type == '2' && data[i].status == '0'){
                            $('.radioSms').attr("disabled", true);
                            $('.noOpenSms, .alreadyOpenSms').remove();
                            $('.underReviewSms').show();
                        }
                        if(data[i].type == '3' && data[i].status == '1'){
                            $('.radioEmail').attr("disabled", true);
                            $('.noOpenEmail, .underReviewEmail').remove();
                            $('.alreadyOpenEmail').show();
                            $('.iconEmail').removeClass("icon-gantanhao color-red").addClass("icon-duihao color-green");
                        }else if(data[i].type == '3' && data[i].status == '0'){
                            $('.radioEmail').attr("disabled", true);
                            $('.noOpenEmail, .alreadyOpenEmail').remove();
                            $('.underReviewEmail').show();
                        }
                    })
                }
            }, "json");
        }
    }, function (response) {
        LayerFun(response.errcode);
    });

    //select input
    $("input[type='radio']").change(function () {
        $(this).parent().siblings().removeClass("none");
        $(this).parents(".configServerItem").siblings().find(".keyBox").addClass("none");
    });

    //set config serve
    $('.configServeBtn').click(function () {
        var type = $("input[type='radio']:checked").val(), url = '';
        var key = $("input[type='radio']:checked").parent().siblings().children("input[type='text']").val();
        return;
        if(type == false){
            LayerFun("pleaseSelectOpenServer");
            return;
        }
        if(type == '1'){
            url = "http://agent_service.fnying.com/upload_file/set_upload_file_service.php"
        }
        if(type == '2'){
            url = "http://agent_service.fnying.com/sms/set_sms_service.php"
        }
        if (type == '3') {
            url = "http://agent_service.fnying.com/email/set_email_service.php"
        }
        var data = {"la_id": la_id, "type": type};
        $.post(url, data, function (response){
            if(response.errcode == '0'){
                LayerFun("submitSuccess");
                if(type == '1'){
                    $('.noOpenFile').fadeOut();
                    $('.underReviewFile').fadeIn();
                }
                if(type == '2'){
                    $('.noOpenSms').fadeOut();
                    $('.underReviewSms').fadeIn();
                }
                if(type == '3'){
                    $('.noOpenEmail').fadeOut();
                    $('.underReviewEmail').fadeIn();
                }
            }else {
                LayerFun("submitFail");
                return;
            }
        }, "json")
    });

    //Get SMS interface
    // GetSmsInterface(token, function (response) {
    //     if (response.errcode == '0') {
    //         var data = response.row;
    //         $('#accessKeyId').val(data.accessKeyId);
    //         $('#accessKeySecret').val(data.accessKeySecret);
    //         $('#SignName').val(data.SignName);
    //         $('#TemplateCode').val(data.TemplateCode);
    //     }
    // }, function (response) {
    //     LayerFun(response.errcode);
    //     return;
    // });

    //Configure SMS interface
    // $('.smsInterfaceBtn').click(function () {
    //     var accessKeyId = $('#accessKeyId').val(), accessKeySecret = $('#accessKeySecret').val(),
    //         SignName = $('#SignName').val(), TemplateCode = $('#TemplateCode').val();
    //     var $this = $(this), btnText = $(this).text();
    //     if (DisableClick($this)) return;
    //     SetSmsInterface(token, accessKeyId, accessKeySecret, SignName, TemplateCode, function (response) {
    //         if (response.errcode == '0') {
    //             LayerFun('successfullyModified');
    //             ActiveClick($this, btnText);
    //         }
    //     }, function (response) {
    //         ActiveClick($this, btnText);
    //         LayerFun(response.errcode);
    //         return;
    //     });
    // });

    //Get the mailbox interface configuration information
    // GetEmailInterface(token, function (response) {
    //     if (response.errcode == '0') {
    //         var data = response.row;
    //         $('#email_Host').val(data.Host);
    //         $('#email_username').val(data.Username);
    //         $('#email_password').val(data.Password);
    //         $('#email_address').val(data.address);
    //         $('#email_name').val(data.name);
    //     }
    // }, function (response) {
    //     LayerFun(response.errcode);
    //     return;
    // });

    //Configure the mailbox interface
    // $('.emailInterfaceBtn').click(function () {
    //     var Host = $('#email_Host').val(), Username = $('#email_username').val(),
    //         Password = $('#email_password').val(), address = $('#email_address').val(), name = $('#email_name').val();
    //     var $this = $(this), btnText = $(this).text();
    //     if (DisableClick($this)) return;
    //     SetEmailInterface(token, Host, Username, Password, address, name, function (response) {
    //         if (response.errcode == '0') {
    //             LayerFun('successfullyModified');
    //             ActiveClick($this, btnText);
    //         }
    //     }, function (response) {
    //         ActiveClick($this, btnText);
    //         LayerFun(response.errcode);
    //         return;
    //     });
    // });

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
        SetPermission(token, pid, real_name, pass_word_hash, user, function (response) {
            if (response.errcode == '0') {
                LayerFun('setSuccessfully');
                return;
            }
        }, function (response) {
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

    //get la_id
    var la_id = "";
    GetLaId(token, function (response) {
        if (response.errcode == '0') {
            la_id = response.la_id;
        }
    }, function (response) {
        LayerFun(response.errcode);
    });

    //Upload image
    $('#uploadFile').on('change', function () {
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // Modify the address attribute of the picture here
            $(".uploadImgSrc").attr("src", objUrl);
        }

        var formData = new FormData($("#uploadForm")[0]);
        formData.append("la_id", la_id);
        formData.append("id", la_id);
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
        console.log(formData);
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
                console.log(data);
                if (data.errcode == '0') {
                    src = data.url;
                    console.log(src);
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