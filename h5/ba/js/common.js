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
        window.location.href = 'BaLogin.html';
        return;
    }
}

// 取us_cookies函数
function GetUsCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    if (arr == null) {
        window.location.href = '../user/login.html';
        return;
    }
}

// 删除cookie函数
function DelCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cookieVal = GetCookie(name);
    if (cookieVal != null) document.cookie = name + "=" + cookieVal + ";expires=" + exp.toGMTString() + ';path=/';
}

// 取得URL参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    console.log(r);
    if (r != null) return unescape(r[2]);
    return null;
    // console.log(r);
}

// Email格式检查
function IsEmail(s) {
    var patrn = /^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/;
    return patrn.exec(s);
}

//获取配置文件
var config_api_url = '', config_h5_url = '', userLanguage = getCookie('userLanguage');
$.ajax({
    url: '../../assets/json/config_url.json',
    async: false,
    type: "GET",
    dataType: "json",
    success: function (data) {
        config_api_url = data.api_url;
        config_h5_url = data.h5_url;
        $('.base_type').text(data.benchmark_type.toUpperCase());
        SetCookie('benchmark_type', data.benchmark_type.toUpperCase());
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

    var api_site = config_api_url + 'api/ba/';

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
};

// 调用USER API共通函数
function CallUserApi(api_url, post_data, suc_func, error_func) {

    var api_site = config_api_url + 'api/user/';

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
};

// 调用la API注册函数
function CallLaApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + 'api/la/admin/admin/';
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

//一般ba充值保证金la函数
function CallLaBase(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + 'api/base/';
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

//获取图形验证码
function GetImgCode() {
    var src = config_api_url + 'api/inc/code.php';
    $('#email_imgCode').attr("src", src);
    $('#phone_imgCode').attr("src", src);
}

//获取代理类型
function GetAgentMode(suc_func, error_func) {
    var api_url = 'get_ba_bit_type.php',
        post_data = {

        };
    CallApi(api_url, post_data, suc_func, error_func)
}

//检查是否允许注册
function RegisterSwitch(type, suc_func, error_func) {
    var api_url = 'reg_lock.php',
        post_data = {
            'type' : type
        };
    CallLaApi(api_url, post_data, suc_func, error_func);
}

//邮箱注册
function EmailRegister(email, pass_word, pass_word_hash, bit_type, suc_func, error_func) {
    var api_url = 'mst_reg_email.php',
        post_data = {
            'email': email,
            'pass_word': pass_word,
            'pass_word_hash': pass_word_hash,
            'bit_type': bit_type
        };
    CallApi(api_url, post_data, suc_func, error_func)
};

//手机注册
function PhoneRegister(country_code, cellphone, bit_type, pass_word, pass_word_hash, sms_code, suc_func, error_func) {
    var api_url = 'mst_reg_phone.php',
        post_data = {
            'country_code': country_code,
            'cellphone': cellphone,
            'bit_type': bit_type,
            'pass_word': pass_word,
            'pass_word_hash': pass_word_hash,
            'sms_code': sms_code,
        };
    CallApi(api_url, post_data, suc_func, error_func);
};
//获取手机验证码
function GetPhoneCode(cellphone, country_code, bind_type, cfm_code, suc_func, error_func){
    var api_url = 'sms_send.php',
        post_data = {
            'cellphone':cellphone,
            'country_code':country_code,
            'bind_type':bind_type,
            'cfm_code':cfm_code
        };
    CallApi(api_url, post_data, suc_func, error_func);
}
//邮箱登录
function EmailLogin(email, pass_word_hash, cfm_code, suc_func, error_func) {
    var api_url = 'lgn_email.php',
        post_data = {
            'email': email,
            'pass_word_hash': pass_word_hash,
            'cfm_code': cfm_code
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//手机登录
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
};

//重置邮箱密码--获取验证码
function GetEmailCode(email, suc_func, error_func) {
    var api_url = 'cfm_email_preform.php',
        post_data = {
            'email' : email
        };
    CallApi(api_url, post_data, suc_func, error_func)
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

//获取ba基本信息
function GetBasicInformation(token, suc_func, error_func) {
    var api_url = 'mst_info_base.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//一般ba充值保证金
function RechargeManage(token, base_amount, suc_func, error_func) {
    var api_url = 'ba_recharge_quest.php',
        post_data = {
            'token': token,
            'base_amount': base_amount
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//一般ba提现保证金
function WithdrawManage(token, base_amount, fun_pass, suc_func, error_func) {
    var api_url = 'ba_withdraw_quest.php',
        post_data = {
            'token': token,
            'base_amount': base_amount,
            'fun_pass': fun_pass
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//修改ba昵称
function ModifyNickName(token, ba_account, suc_func, error_func) {
    var api_url = 'alter_ba_account.php',
        post_data = {
            'token': token,
            'ba_account': ba_account
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//获取ba绑定信息
function GetBindInformation(token, suc_func, error_func) {
    var api_url = 'mst_info_bind.php',
        post_data = {
            'token': token
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

//文本绑定
function TextBind(token, text_type, text, text_hash, suc_func, error_func) {
    var api_url = 'bnd_text.php',
        post_data = {
            'token': token,
            'text_type': text_type,
            'text': text,
            'text_hash': text_hash
            // 'pass_word_hash': pass_word_hash
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
            'token':token,
            'hash':hash,
            'phone':phone,
            'phoneCode':phoneCode,
            'hash_type':hash_type,
            'pass_word_hash':pass_word_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//账户变动记录/登录记录查询
function ChangeCode(token, limit, offset, api_url, suc_func, error_func) {
    // var api_url = 'log_balance.php',
    var post_data = {
        'token': token,
        'limit': limit,
        'offset': offset
    };
    CallApi(api_url, post_data, suc_func, error_func);
}

//获取保证金充值地址GetMarginWithdrawAddress
function GetMarginAddress(token, suc_func, error_func) {
    var api_url = 'get_bit_address_recharge.php',
        post_data = {
            'token': token
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//添加保证金充值地址
function AddMarginRechargeAddress(token, bit_address, suc_func, error_func) {
    var api_url = 'bit_address_recharge_add.php',
        post_data = {
        'token': token,
        'bit_address': bit_address
    };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//获取保证金提现地址
function GetMarginWithdrawAddress(token, suc_func, error_func) {
    var api_url = 'get_bit_address_withdraw.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//添加保证金提现地址
function AddMarginWithdrawAddress(token, bit_address, fun_pass, suc_func, error_func) {
    var api_url = 'bit_address_withdraw_add.php',
        post_data = {
            'token': token,
            'bit_address': bit_address,
            'fun_pass': fun_pass
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//保证金充值待处理列表
function GetMarginRechargePending(token, type, suc_func, error_func) {
    var api_url = 'log_base_recharge.php',
        post_data = {
            'token': token,
            'type': type
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//确认处理保证金充值
function MarginRechargeConfirm(token, type, qa_id, suc_func, error_func) {
    var api_url = 'base_recharge_confirm.php',
        post_data = {
            'token': token,
            'type': type,
            'qa_id': qa_id
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//保证金充值已处理
function GetRechargeAlready(token, suc_func, error_func) {
    var api_url = '',
        post_data = {
            'token': token
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//保证金提现待处理列表
function GetMarginWithdrawPending(token, type, suc_func, error_func) {
    var api_url = 'log_base_withdraw.php',
        post_data = {
            'token': token,
            'type': type
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//确认处理保证金提现
function MarginWithdrawConfirm(token, type, qa_id, transfer_tx_hash, suc_func, error_func) {
    var api_url = 'base_withdraw_confirm.php',
        post_data = {
            'token': token,
            'type': type,
            'qa_id': qa_id,
            'transfer_tx_hash': transfer_tx_hash
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//登录记录查询
// function LoginRecordQuery(token, limit, offset, suc_func, error_func){
//     var api_url = 'log_login.php',
//         post_data = {
//             'token': token,
//             'limit': limit,
//             'offset': offset
//         };
//     CallApi(api_url, post_data, suc_func, error_func);
// };
//充值汇率设定
function rechargeRate(token, recharge_rate, recharge_min_amount, recharge_max_amount, limit_time, is_void, recharge_us_level, pass_word_hash, suc_func, error_func) {
    var api_url = 'set_recharge_rate.php',
        post_data = {
            'token': token,
            'recharge_rate': recharge_rate,
            'recharge_min_amount': recharge_min_amount,
            'recharge_max_amount': recharge_max_amount,
            'limit_time': limit_time,
            'is_void': is_void,
            'recharge_us_level': recharge_us_level,
            'pass_word_hash': pass_word_hash
        };
    CallApi(api_url, post_data, suc_func, error_func)
};

//获取充值汇率
function GetRechargeRate(token, suc_func, error_func) {
    var api_url = 'get_recharge_rate.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//提现汇率设定
function withdrawRate(token, withdraw_rate, withdraw_min_amount, withdraw_max_amount, limit_time, is_void, withdraw_us_level, pass_word_hash, suc_func, error_func) {
    var api_url = 'set_withdraw_rate.php',
        post_data = {
            'token': token,
            'withdraw_rate': withdraw_rate,
            'withdraw_min_amount': withdraw_min_amount,
            'withdraw_max_amount': withdraw_max_amount,
            'limit_time': limit_time,
            'is_void': is_void,
            'withdraw_us_level': withdraw_us_level,
            'pass_word_hash': pass_word_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//获取提现汇率
function GetWithdrawRate(token, suc_func, error_func) {
    var api_url = 'get_withdraw_rate.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//添加地址
function AddAddress(token, bit_address, is_void, suc_fun, error_fun) {
    var api_url = 'bit_address_add.php',
        post_data = {
            'token': token,
            'is_void': is_void,
            'bit_address': bit_address
        };
    CallApi(api_url, post_data, suc_fun, error_fun);
}

//获取添加的地址
function QueryAddress(token, limit, offset, suc_func, error_func) {
    var api_url = 'get_ba_asset_bit_account.php',
        post_data = {
            'token': token,
            'limit': limit,
            'offset': offset
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//客户充值请求
function RechargeQuest(token, ba_id, bit_type, bit_address, bit_amount, chg_amount, tx_hash, tx_id, suc_func, error_func) {
    var api_url = 'us_recharge_quest.php',
        post_data = {
            'token': token,
            'ba_id': ba_id,
            'bit_type': bit_type,
            'bit_address': bit_address,
            'bit_amount': bit_amount,
            'chg_amount': chg_amount,
            'tx_hash': tx_hash,
            'tx_id': tx_id
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//客户提现请求
function WithdrawQuest(token, ba_id, bit_type, bit_address, bit_amount, chg_amount, suc_func, error_func) {
    var api_url = 'us_withdraw_quest.php',
        post_data = {
            'token': token,
            'ba_id': ba_id,
            'bit_type': bit_type,
            'bit_address': bit_address,
            'bit_amount': bit_amount,
            'chg_amount': chg_amount
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//代理用户充值提现记录查询
function RechargeWithdrawCodeQuery(token, api_url, type, suc_func, error_func) {
    var post_data = {
        'token': token,
        'type': type
    };
    CallApi(api_url, post_data, suc_func, error_func);
};

//充值请求确认处理
function RechargeConfirm(token, qa_id, type, suc_func, error_func) {
    var api_url = 'recharge_confirm.php',
        post_data = {
            'token': token,
            'type': type,
            'qa_id': qa_id
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//提现请求确认处理
function WithdrawConfirm(token, qa_id, type, transfer_tx_hash, suc_func, error_func) {
    var api_url = 'withdraw_confirm.php',
        post_data = {
            'token': token,
            'qa_id': qa_id,
            'type': type,
            'transfer_tx_hash': transfer_tx_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//获取ba
function GetBaItem(api_url, token, bit_type, suc_func, error_func) {
    var post_data = {
        'token': token,
        'bit_type': bit_type
    };
    CallApi(api_url, post_data, suc_func, error_func);
}

//锁定充值金额提交
function LockAmount(token, ba_id, base_amount, bit_amount, bit_type, us_level, suc_func, error_func) {
    var api_url = 'us_recharge_quest.php',
        post_data = {
            'token': token,
            'ba_id': ba_id,
            'base_amount': base_amount,
            'bit_amount': bit_amount,
            'bit_type': bit_type,
            'us_level': us_level
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//锁定提现发送请求
function LockWithdraw(token, ba_id, base_amount, bit_type, bit_amount, us_level, bit_address, suc_func, error_func) {
    var api_url = 'us_withdraw_quest.php',
        post_data = {
            'token': token,
            'ba_id': ba_id,
            'base_amount': base_amount,
            'bit_amount': bit_amount,
            'bit_type': bit_type,
            'bit_address': bit_address,
            'us_level': us_level
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
        // email_cfm_code = drawPic();
        return;
    }

    setTimeout(function () {
        CountDown(counts, ErrorNum, LoginBtn, input, LoginError)
    }, 1000)
};

//获取手机验证码
function BaGetPhoneCode(cellphone, country_code, bind_type, suc_func, error_func) {
    var api_url = 'sms_send.php',
        post_data = {
            'cellphone': cellphone,
            'country_code': country_code,
            'bind_type': bind_type
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
}

//获取user基本信息
function GetUserBaseInfo(token, suc_func, error_func) {
    var api_url = 'info_base.php',
        post_data = {
            'token': token
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
}

//检查user绑定信息
function CheckUserBindInfo(token, suc_func, error_func) {
    var api_url = 'info_bind.php',
        post_data = {
            'token': token
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
}

//user添加提现地址
function ConfirmAddAddress(token, bit_type, bit_address, pass_word_hash, suc_func, error_func) {
    var api_url = 'bit_address_add.php',
    post_data = {
        'token': token,
        'bit_type': bit_type,
        'bit_address': bit_address,
        'pass_word_hash': pass_word_hash
    };
    CallUserApi(api_url, post_data, suc_func, error_func);
}

//user提现订单详情
function GetWithdrawInfo(token, suc_func, error_func) {
    var api_url = 'order_ba_withdraw_list.php',
        post_data = {
            'token': token
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
}

//验证资金密码
function CfmFundPass(token, cfm_fundPass, suc_func, error_func) {
    var api_url = 'cfm_fundpass.php',
        post_data = {
            'token': token,
            'cfm_fundPass': cfm_fundPass
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
};

//验证手机短信码
function CfmPhone(sms_code, country_code, cellphone, suc_func, error_func) {
    var api_url = 'cfm_phone.php',
        post_data = {
            'sms_code': sms_code,
            'country_code': country_code,
            'cellphone': cellphone
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
}

//下载订单

// function Download(token, suc_func, error_func) {
//     var api_url = 'transaction_order_download.php',
//         post_data = {
//             'token': token
//         };
//     CallDownloadApi(api_url, post_data, suc_func, error_func);
// }
/**
 * 禁用按钮
 * @param $this 按钮对象
 * @param btnText 按钮文本内容 默认为"处理中"
 * @return {boolean}
 */
function DisableClick($this, btnText) {
    if (!$this) {
        // console.warn("$this 不能为空");
        return true;
    }
    var status = Number($this.attr('data-clickStatus') || 1);
    if (status == 0) {
        return true;
    }

    btnText = btnText ? btnText : "Loading...";
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
 * */
window.onload = function () {
    if (document.readyState === 'complete') {
        document.body.style.overflow = "auto";
        var loading = document.querySelector(".loading");
        loading.parentNode.removeChild(loading);
    }
};
