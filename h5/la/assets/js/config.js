$(function () {
    //获取token
    var token = GetCookie('la_token');

    // 配置url
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

    //获取la基本信息
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

    // setTimeout(BaseCurrency(), 2000);


    //获取短信接口SetEmailInterface
    GetSmsInterface(token, function (response) {
        if(response.errcode == '0'){
            var data = response.row;
            $('#accessKeyId').val(data.accessKeyId);
            $('#accessKeySecret').val(data.accessKeySecret);
            $('#SignName').val(data.SignName);
            $('#TemplateCode').val(data.TemplateCode);
        }
    }, function (response) {
        GetErrorCode(response.errcode);
        return;
    });

    //配置短信接口
    $('.smsInterfaceBtn').click(function () {
        var accessKeyId = $('#accessKeyId').val(), accessKeySecret = $('#accessKeySecret').val(),
            SignName = $('#SignName').val(), TemplateCode = $('#TemplateCode').val();
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        SetSmsInterface(token, accessKeyId, accessKeySecret, SignName, TemplateCode, function (response) {
            if(response.errcode == '0'){
                LayerFun('successfullyModified');
                ActiveClick($this, btnText);
            }
        }, function (response) {
            ActiveClick($this, btnText);
            GetErrorCode(response.errcode);
            return;
        });
    });

    //获取邮箱接口配置信息
    GetEmailInterface(token, function (response) {
        if(response.errcode == '0'){
            var data = response.row;
            $('#email_Host').val(data.Host);
            $('#email_username').val(data.Username);
            $('#email_password').val(data.Password);
            $('#email_address').val(data.address);
            $('#email_name').val(data.name);
        }
    }, function (response) {
        GetErrorCode(response.errcode);
        return;
    });

    //配置邮箱接口
    $('.emailInterfaceBtn').click(function () {
        var Host = $('#email_Host').val(), Username = $('#email_username').val(),
            Password = $('#email_password').val(), address = $('#email_address').val(), name = $('#email_name').val();
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        SetEmailInterface(token, Host, Username, Password, address, name, function (response) {
            if(response.errcode == '0'){
                LayerFun('successfullyModified');
                ActiveClick($this, btnText);
            }
        }, function (response) {
            ActiveClick($this, btnText);
            GetErrorCode(response.errcode);
            return;
        });
    });

    //获取注册权限显示
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

    //获取us/ba/ca注册权限
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

    //ba/ca/us注册权限开启成功(关闭失败)函数
    function SetSwitchStyleSuc(_this) {
        _this.prop('checked', true);
        _this.siblings('.setOn').css('color', '#26a69a');
        _this.siblings('.setOff').css('color', '#9e9e9e');
        _this.parents('.switchBox').find('.setType').text(_this.siblings('.setOn').text());
    }

    //ba/ca/us注册权限开启失败(关闭成功)函数
    function SetSwitchStyleFail(_this) {
        _this.prop('checked', false);
        _this.siblings('.setOff').css('color', '#26a69a');
        _this.siblings('.setOn').css('color', '#9e9e9e');
        _this.parents('.switchBox').find('.setType').text(_this.siblings('.setOff').text());
    }

    //设置us/ba/ca注册权限
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

    //设置允许ba注册
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

    //设置允许ca注册
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

    //设置允许user注册
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

    //设置管理员
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

    //获取已经设置的BA代理类型
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

    //选择Ba代理类型
    $('.baseBaTypeBox li').click(function () {
        var liVal = $(this).text();
        $('.baseBaTypeInput').val(liVal);
        $(this).addClass('baseLiActive').siblings().removeClass('baseLiActive');
    });

    //设置BA代理类型
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

    //删除BA代理类型
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

    //获取已经设置的CA代理类型
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

    //选择Ca代理类型
    $('.baseCaTypeBox li').click(function () {
        var liVal = $(this).text(), name = $(this).attr('title');
        $('.baseCaTypeInput').val(liVal);
        $('.baseCaTypeInput').attr('name', name);
        $(this).addClass('baseLiActive').siblings().removeClass('baseLiActive');
    });

    //设置CA代理类型
    // $('.baseCaTypeInput').keydown(function () {
    //     if (event.keyCode == '8') {
    //         $(this).attr('name', '');
    //     }
    // });
    $('.baseCaTypeBtn').click(function () {
        // var option_key = '';
        // if ($('.baseCaTypeInput').attr('name') != null) {
        //     option_key = $('.baseCaTypeInput').attr('name');
        // } else {
        option_key = $('.baseCaTypeInput').val();
        // }

        option_value = $('.baseCaTypeInput').val();
        if (option_key.length <= 0) {
            LayerFun('pleaseSelectOrManuallyEnterTheAllowedDigitalCurrencyProxyType');
            return;
        }
        $('#uploadImgModal').modal('open');
        $('.baseBaTypeBtnConfirm').addClass('ca');
    });

    //删除CA代理类型
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

    //上传图片确定BA/CA
    $('.baseBaTypeBtnConfirm').click(function () {
        var api_url = '';
        $('#uploadImgModal').modal('close');
        if ($(this).hasClass('ca')) {
            api_url = 'set_ca_channel.php';
            SetAgentType(api_url, token, option_key, option_value, option_src, function (response) {
                if (response.errcode == '0') {
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
                    LayerFun('setSuccessfully');
                    GetBaTypeFun();
                }
            }, function (response) {
                LayerFun('setupFailed');
                GetErrorCode(response.errcode);
            })
        }
    });

    //上传图片确定CA
    // $('.ca').click(function () {
    //     $('#uploadImgModal').modal('close');
    //     var api_url = 'set_ca_channel.php';
    //     console.log(api_url);return;
    //
    // });

    //上传图片取消
    $('.uploadImgRow .cancel').click(function () {
        $('#uploadImgModal').modal('close');
    });

    //上传图片
    // var option_src = '';
    $('#uploadFile').on('change', function () {
        var objUrl = getObjectURL(this.files[0]);
        if (objUrl) {
            // 在这里修改图片的地址属性
            $(".uploadImgSrc").attr("src", objUrl);
        }

        var formData = new FormData($("#uploadForm")[0]);
        option_src = UpLoadImg(formData).src;
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

    //返回图片信息
    var url = getRootPath();
    var config_api_url = '', config_h5_url = '';
    $.ajax({
        url: url+"/h5/assets/json/config_url.json",
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

    //初始化modal
    $('#uploadImgModal').modal({
        dismissible: true,
        opacity: .5,
        in_duration: 300,
        out_duration: 200,
    });
});