// 设置cookies函数
function SetCookie(name, value) {
    var now = new Date();
    var time = now.getTime();
    // 有效期2小时
    time += 3600 * 1000 * 2;
    now.setTime(time);
    document.cookie = name + "=" + escape(value) + '; expires=' + now.toUTCString() + ';path=/';
}

// 取cookies函数
function GetCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    if (arr == null) {
        window.location.href = 'login.html';
    }
    return null;
}

// 删除cookie函数
function DelCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = GetCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ';path=/';
}


// 取得URL参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// Email格式检查
function IsEmail(s) {
    var patrn = /^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/;
    return patrn.exec(s);
}

function getRootPath() {
    //获取当前网址
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址
    var localhostPath = curWwwPath.substring(0, pos);
    //获取带"/"的项目名
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return(localhostPath + projectName);
}
var url = getRootPath();
console.log(url);

//获取数据失败提示
function GetErrorCode(code) {
    $.getJSON(url+"/h5/assets/json/errcode.json", function (response) {
        $.each(response, function (i, val) {
            if (response[i].code_key == code) {
                layer.msg('<p class="i18n" name="'+ code +'">' + response[i].code_value + '</p>');
                execI18n();
            }
        })
    })
}

//获取配置文件/基准货币类型
var config_api_url = '', config_h5_url = '', userLanguage = getCookie('userLanguage');
    $.ajax({
        url: url+"/h5/assets/json/config_url.json",
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data);
            config_api_url = data.api_url;
            config_h5_url = data.h5_url;
            var benchmark_type = data.benchmark_type.toUpperCase();
            var ca_currency = data.ca_currency.toUpperCase();
            $('.base_type').text(benchmark_type);
            $('.ca_currency').text(ca_currency);
            SetCookie('ca_currency', ca_currency);
            SetCookie('benchmark_type', benchmark_type);
            if(!userLanguage){
                SetCookie('userLanguage', data.userLanguage);
            }else {
                return;
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });

// 调用API共通函数
function CallApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/api/user/';
    post_data = post_data || {};
    suc_func = suc_func || function () {
    };
    error_func = error_func || function () {
    };
    $.ajax({
        url: api_site + api_url,
        dataType: "jsonp",
        data: post_data,
        success: function (response) {
            // API返回失败
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // 成功处理数据
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API错误异常
            var response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // 异常处理
            error_func(response);
        }
    });
}

// 调用Ba API共通函数
function CallBaApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/api/ba/';
    post_data = post_data || {};
    suc_func = suc_func || function () {
    };
    error_func = error_func || function () {
    };
    $.ajax({
        url: api_site + api_url,
        dataType: "jsonp",
        data: post_data,
        success: function (response) {
            // API返回失败
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // 成功处理数据
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API错误异常
            var response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // 异常处理
            error_func(response);
        }
    });
}

// 调用ca API共通函数
function CallCaApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/api/ca/';
    post_data = post_data || {};
    suc_func = suc_func || function () {
    };
    error_func = error_func || function () {
    };
    $.ajax({
        url: api_site + api_url,
        dataType: "jsonp",
        data: post_data,
        success: function (response) {
            // API返回失败
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // 成功处理数据
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API错误异常
            var response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // 异常处理
            error_func(response);
        }
    });
}

// 调用la API注册函数
function CallLaApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/api/la/admin/admin/';
    post_data = post_data || {};
    suc_func = suc_func || function () {
    };
    error_func = error_func || function () {
    };
    $.ajax({
        url: api_site + api_url,
        dataType: "jsonp",
        data: post_data,
        success: function (response) {
            // API返回失败
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // 成功处理数据
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API错误异常
            var response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // 异常处理
            error_func(response);
        }
    });
}

//检查是否允许注册
function RegisterSwitch(type, suc_func, error_func) {
    var api_url = 'reg_lock.php',
        post_data = {
            'type' : type
        };
    CallLaApi(api_url, post_data, suc_func, error_func);
}

//获取图形验证码
function GetImgCode() {
    var src = config_api_url + '/api/inc/code.php';
    $('#email_imgCode').attr("src", src);
    $('#phone_imgCode').attr("src", src);
}

// 邮箱注册
function EmailRegister(email, pass_word, pass_word_hash, invit_code, suc_func, error_func) {
    var api_url = 'reg_email.php',
        post_data = {
            'email': email,
            'pass_word_hash': pass_word_hash,
            'pass_word': pass_word,
            'invit_code': invit_code
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//手机注册处理
function PhoneRegister(country_code, cellphone, sms_code, pass_word, pass_word_hash, invit_code, suc_func, error_func) {
    var api_url = 'reg_phone.php',
        post_data = {
            'country_code': country_code,
            'cellphone': cellphone,
            'sms_code': sms_code,
            'pass_word': pass_word,
            'pass_word_hash': pass_word_hash,
            'invit_code': invit_code
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//邮箱登录处理
function EmailLogin(email, pass_word_hash, cfm_code, suc_func, error_func) {
    var api_url = 'lgn_email.php',
        post_data = {
            'email': email,
            'pass_word_hash': pass_word_hash,
            'cfm_code': cfm_code
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//手机登录处理
function PhoneLogin(country_code, cellphone, pass_word_hash, sms_code, cfm_code, suc_func, error_func) {
    var api_url = 'lgn_phone.php',
        post_data = {
            'country_code': country_code,
            'cellphone': cellphone,
            'pass_word_hash': pass_word_hash,
            'sms_code': sms_code,
            'cfm_code': cfm_code
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

// 重置密码(邮箱)
function ResetEmailPassword(email, cfm_code, pass_word_hash, suc_func, error_func) {
    var api_url = 'rst_pw_email.php',
        post_data = {
            'email': email,
            'cfm_code': cfm_code,
            'pass_word_hash': pass_word_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//重置邮箱密码--获取验证码
function GetEmailCode(email, suc_func, error_func) {
    var api_url = 'cfm_email_preform.php',
        post_data = {
            'email': email
        };
    CallApi(api_url, post_data, suc_func, error_func)
}

// 重置密码(手机)
function ResetPhonePassword(country_code, cellphone, sms_code, pass_word_hash, suc_func, error_func) {
    var api_url = 'rst_pw_phone.php',
        post_data = {
            'country_code': country_code,
            'cellphone': cellphone,
            'sms_code': sms_code,
            'pass_word_hash': pass_word_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

// 用户绑定信息
function BindingInformation(token, suc_func, error_func) {
    var api_url = 'info_bind.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//修改us昵称
function ModifyNickName(token, us_account, suc_func, error_func) {
    var api_url = 'alter_us_account.php',
        post_data = {
            'token': token,
            'us_account': us_account
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

// 用户信息
function UserInformation(token, suc_func, error_func) {
    var api_url = 'info_base.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

// 用户变动记录-登录记录-转账-BA/CA-充值/提现-记录
function AllRecord(token, limit, offset, api_url, suc_func, error_func) {
    var post_data = {
        'token': token,
        'limit': limit,
        'offset': offset
    };
    CallApi(api_url, post_data, suc_func, error_func);
}

//获取订单交易状态
function TradingStatus(token, limit, offset, type, suc_func, error_func) {
    var api_url = 'log_balance.php',
        post_data = {
            'token': token,
            'limit': limit,
            'offset': offset,
            'type': type
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

// 文本绑定
function TextBind(token, text_type, text, text_hash, suc_func, error_func) {
    var api_url = 'bnd_text.php',
        post_data = {
            'token': token,
            'text_type': text_type,
            'text': text,
            'text_hash': text_hash,
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

// 文本修改
function TextModify(token, text_type, text, text_hash, pass_word_hash, suc_func, error_func) {
    var api_url = 'change_text.php',
        post_data = {
            'token': token,
            'text_type': text_type,
            'text': text,
            'text_hash': text_hash,
            'pass_word_hash': pass_word_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

// 文件绑定
function FileBind(token, file_type, file_url, file_hash, suc_func, error_func) {
    var api_url = 'bnd_file.php',
        post_data = {
            'token': token,
            'file_type': file_type,
            'file_url': file_url,
            'file_hash': file_hash,
            // 'pass_word_hash': pass_word_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//HASH绑定
function Hash(token, hash_type, hash, pass_word_hash, phone, phoneCode, suc_func, error_func) {
    var api_url = 'bnd_hash.php',
        post_data = {
            'token': token,
            'hash': hash,
            'phone': phone,
            'phoneCode': phoneCode,
            'hash_type': hash_type,
            'pass_word_hash': pass_word_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//google绑定
function GoogleBind(token, email, suc_func, error_func) {
    var api_url = 'bnd_Google.php',
        post_data = {
            'token' : token,
            'email' : email
        };
        CallApi(api_url, post_data, suc_func, error_func);
}

//google验证
function GoogleVerify(token, code, suc_func, error_func) {
    var api_url = 'cfm_Google.php',
        post_data = {
            'token' : token,
            'code' : code
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//获取ba充值提现列表
function GetBaRateList(api_url, token, suc_func, error_func) {
    var post_data = {
        'token': token
    };
    CallBaApi(api_url, post_data, suc_func, error_func);
}

//获取ca充值提现汇率的平均值
function GetAverageRate(api_url, token, suc_func, error_func) {
    var post_data = {
        'token': token
    };
    CallCaApi(api_url, post_data, suc_func, error_func);
}

//获取手机验证码
function GetPhoneCode(cellphone, country_code, bind_type, cfm_code, suc_func, error_func) {
    var api_url = 'sms_send.php',
        post_data = {
            'cellphone': cellphone,
            'country_code': country_code,
            'bind_type': bind_type,
            'cfm_code': cfm_code
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//获取申报列表
function GetFaultReportList(token, suc_func, error_func) {
    var api_url = 'feedback_list.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//提交故障申报
function SubmitFaultReportInfo(token, sub_id, end_type, submit_name, submit_info, suc_func, error_func) {
    var api_url = 'feedback_submit.php',
        post_data = {
            'token': token,
            'sub_id': sub_id,
            'end_type': end_type,
            'submit_name': submit_name,
            'submit_info': submit_info
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//获取用户需要添加的银行卡列表
function GetBankList(token, suc_func, error_func) {
    var api_url = 'us_channel_list.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func)
}

//确认添加银行卡
function AddBank(token, cash_channel, cash_type, cash_address, name, idNum, pass_word_hash, suc_func, error_func) {
    var api_url = 'bank_card_business.php',
        post_data = {
            'token': token,
            'cash_channel': cash_channel,
            'cash_type': cash_type,
            'cash_address': cash_address,
            'name': name,
            'idNum': idNum,
            'pass_word_hash': pass_word_hash,
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//获取添加的银行卡列表
function GetAddBankList(token, suc_func, error_func) {
    var api_url = 'get_bank_card_list.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//删除绑定的银行卡
function DeleteBank(token, account_id, suc_func, error_func) {
    var api_url = 'del_us_bank_card.php',
        post_data = {
            'token': token,
            'account_id': account_id
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//登录失败倒计时
function CountDown(count, ErrorNum, LoginBtn, input, LoginError) {
    var counts = count;
    if (counts != 0) {
        counts--;
        ErrorNum.text(counts);
        LoginBtn.attr('disabled', true);
        input.attr('disabled', true);
    } else {
        LoginBtn.attr('disabled', false);
        input.attr('disabled', false);
        input.val('');
        LoginError.fadeOut('fast');
        return;
    }
    ;
    setTimeout(function () {
        CountDown(counts, ErrorNum, LoginBtn, input, LoginError)
    }, 1000)
};

/**
 * 禁用按钮
 * @param $this 按钮对象
 * @param btnText 按钮文本内容 默认为"处理中"
 * @return {boolean}
 */
function DisableClick($this, btnText) {
    if (!$this) {
        console.warn("$this 不能为空");
        return true;
    }
    var status = Number($this.attr('data-clickStatus') || 1);
    if (status == 0) {
        return true;
    }

    btnText = btnText ? btnText : "loading...";
    $this.attr('data-clickStatus', 0);
    $this.html(btnText);
    return false;
}

/**
 * 激活按钮
 * @param $this 按钮对象
 * @param btnText 按钮文本内容 默认为"处理中"
 */
function ActiveClick($this, btnText) {
    if (!$this) {
        console.warn("$this 不能为空");
        return;
    }
    btnText = btnText ? btnText : "确认";
    $this.attr('data-clickStatus', 1);
    $this.html(btnText);
}

/**
 * 初始化页面loading加载
 */
window.onload = function () {
    if (document.readyState === 'complete') {
        document.body.style.overflow = "auto";
        var loading = document.querySelector(".loading");
        loading.parentNode.removeChild(loading);
    }
};

