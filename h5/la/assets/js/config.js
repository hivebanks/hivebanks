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
            GetErrorCode(response.errcode);
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
        GetErrorCode(response.errcode);
        return;
    });

    //get la_id
    var la_id = '';
    GetLaId(token, function (response) {
        if (response.errcode == '0') {
            la_id = response.la_id
        }
    }, function (response) {
        GetErrorCode(response.errcode);
    });

    //config serve
    $('.configServeBtn').click(function () {
        console.log(la_id);
        return;
        var type = $("input[type='radio']:checked").val();
        var data = {
            "la_id": la_id,
            "type": type
        };
        $.ajax({
            url: "http://agent_service.fnying.com/upload_file/set_upload_file_service.php",
            type: "POST",
            dataType: "jsonp",
            data: data,
            success: function (response) {
                LayerFun("setSuccessfully");
                console.log(response);
            },
            error: function (response) {
                LayerFun("setupFailed");
                return;
            }
        })
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
    //     GetErrorCode(response.errcode);
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
    //         GetErrorCode(response.errcode);
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
    //     GetErrorCode(response.errcode);
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
    //         GetErrorCode(response.errcode);
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
            GetErrorCode(response.errcode);
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
            GetErrorCode(response.errcode);
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
            GetErrorCode(response.errcode);
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
            GetErrorCode(response.errcode);
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
            GetErrorCode(response.errcode);
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
            GetErrorCode(response.errcode);
        })
    });

    //Upload image to determine BA/CA
    $('.baseBaTypeBtnConfirm').click(function () {
        var api_url = '';
        if (option_src == '') {
            LayerFun('pleaseUploadAnImageOfTheSelectedType');
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
                GetErrorCode(response.errcode);
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
                GetErrorCode(response.errcode);
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
        option_src = UpLoadImg(formData).src;
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

    //Return image information
    var url = getRootPath();
    var config_api_url = '', config_h5_url = '';
    $.ajax({
        url: url + "/assets/json/config_url.json",
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

    function UpLoadImg(formData) {
        var objData = new Object();
        $.ajax({
            url: config_api_url + '/api/upload/upload_file.php',
            header: {"Access-Control-Allow-Origin": "*"},
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                var data = JSON.parse(response);
                if (data.code == '-1') {
                    LayerFun('imgUploadFail');
                    return;
                }
                objData.src = data.data.src;
                objData.file_hash = data.file_hash;
            },
            error: function (response) {
                LayerFun('imgUploadFail');
                return;
            }
        });
        return objData;
    }

    //init modal
    $('#uploadImgModal').modal({
        dismissible: true,
        opacity: .5,
        in_duration: 300,
        out_duration: 200,
    });
});