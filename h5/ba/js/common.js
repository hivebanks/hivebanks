// Set the cookies function
function SetCookie(name, value) {
    var now = new Date();
    var time = now.getTime();
    // Valid for 2 hours
    time += 3600 * 1000 * 2;
    now.setTime(time);
    document.cookie = name + "=" + escape(value) + '; expires=' + now.toUTCString() + ';path=/';
}

// Take the cookies function
function GetCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    if (arr == null && name == "user_token") {
        window.location.href = '../user/login.html';
        return;
    } else {
        window.location.href = 'BaLogin.html';
        return;
    }
}

// Take the us_cookies function
function GetUsCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    if (arr == null && name == "user_token") {
        DelCookie('user_token');
        window.location.href = '../user/login.html';
        return;
    } else {
        DelCookie('ba_token');
        window.location.href = 'BaLogin.html';
    }
}

// Delete cookie function
function DelCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cookieVal = GetCookie(name);
    if (cookieVal != null) document.cookie = name + "=" + cookieVal + ";expires=" + exp.toGMTString() + ';path=/';
}

// Get URL parameters
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// Email format check
function IsEmail(s) {
    var patrn = /^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/;
    return patrn.exec(s);
}

function getRootPath() {
    //Get current URL
    var curWwwPath = window.document.location.href;
    //Get the directory after the host address
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //Get the host address
    var localhostPath = curWwwPath.substring(0, pos);
    //Get the project name with "/"
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return localhostPath;
}

var url = getRootPath();

//Get failed error code prompt
function GetErrorCode(code) {
    $.getJSON(url + "/h5/assets/json/errcode.json", function (response) {
        $.each(response, function (i, val) {
            if (response[i].code == code) {
                layer.msg('<p class="i18n" name="' + code + '">' + response[i].code_value + '</p>');
                execI18n();
            }
        })
    })
}

//Get configuration file
var config_api_url = '', config_h5_url = '', userLanguage = getCookie('userLanguage');
$.ajax({
    url: url + "/h5/assets/json/config_url.json",
    async: false,
    type: "GET",
    dataType: "json",
    success: function (data) {
        config_api_url = data.api_url;
        config_h5_url = data.h5_url;
        var benchmark_type = data.benchmark_type.toUpperCase();
        var ca_currency = data.ca_currency.toUpperCase();
        $('.base_type').text(benchmark_type);
        SetCookie('benchmark_type', benchmark_type);
        if (!userLanguage) {
            SetCookie('userLanguage', data.userLanguage);
        } else {
            return;
        }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
    }
});

// Call API common function
function CallApi(api_url, post_data, suc_func, error_func) {

    var api_site = config_api_url + '/src/ba/';

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
            // API return failed
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // Successfully process data
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API error exception
            var response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // Exception handling
            error_func(response);
        }
    });
};

// Call the USER API common function
function CallUserApi(api_url, post_data, suc_func, error_func) {

    var api_site = config_api_url + '/src/user/';

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
            // API return failed
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // Successfully process data
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API error exception
            var response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // Exception handling
            error_func(response);
        }
    });
};

// Call the la API registration function
function CallLaApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/src/la/admin/admin/';
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
            // API return failed
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // Successfully process data
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API error exception
            var response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // Exception handling
            error_func(response);
        }
    });
}

// Call the API LA configuration function
function CallLaConfigApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/src/la/admin/configure/';
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
            // API return failed
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // Successfully process data
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API error exception
            var response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // Exception handling
            error_func(response);
        }
    });
}

//General ba recharge margin la function
function CallLaBase(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/src/base/';
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
            // API return failed
            if (response.errcode != 0) {
                error_func(response);
            } else {
                // Successfully process data
                suc_func(response);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // API error exception
            var response = {"errcode": -1, "errmsg": '系统异常，请稍候再试'};
            // Exception handling
            error_func(response);
        }
    });
}

//Get graphic verification code
function GetImgCode() {
    var src = config_api_url + '/src/inc/code.php';
    $('#email_imgCode').attr("src", src);
    $('#phone_imgCode').attr("src", src);
}

//Get proxy type
function GetAgentMode(suc_func, error_func) {
    var api_url = 'get_ba_bit_type.php',
        post_data = {};
    CallApi(api_url, post_data, suc_func, error_func)
}

//Check if registration is allowed
function RegisterSwitch(type, suc_func, error_func) {
    var api_url = 'reg_lock.php',
        post_data = {
            'type': type
        };
    CallLaApi(api_url, post_data, suc_func, error_func);
}

//email registration
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

//Register your phone
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

//Get phone verification code
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

//Get user phone verification code
function GetUserPhoneCode(cellphone, country_code, bind_type, cfm_code, suc_func, error_func) {
    var api_url = 'sms_send.php',
        post_data = {
            'cellphone': cellphone,
            'country_code': country_code,
            'bind_type': bind_type,
            'cfm_code': cfm_code
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
}

//email login
function EmailLogin(email, pass_word_hash, cfm_code, suc_func, error_func) {
    var api_url = 'lgn_email.php',
        post_data = {
            'email': email,
            'pass_word_hash': pass_word_hash,
            'cfm_code': cfm_code
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Log in with phone
function PhoneLogin(country_code, cellphone, pass_word_hash, cfm_code, sms_code, suc_func, error_func) {
    var api_url = 'lgn_phone.php',
        post_data = {
            'country_code': country_code,
            'cellphone': cellphone,
            'pass_word_hash': pass_word_hash,
            'cfm_code': cfm_code,
            'sms_code': sms_code
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//Reset Email Password - Get Verification Code
function GetEmailCode(email, suc_func, error_func) {
    var api_url = 'cfm_email_preform.php',
        post_data = {
            'email': email
        };
    CallApi(api_url, post_data, suc_func, error_func)
}

// Reset password (mailbox)
function ResetEmailPassword(email, cfm_code, pass_word_hash, suc_func, error_func) {
    var api_url = 'rst_pw_email.php',
        post_data = {
            'email': email,
            'cfm_code': cfm_code,
            'pass_word_hash': pass_word_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

// Reset password (phone)
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

//get ba base information
function GetBasicInformation(token, suc_func, error_func) {
    var api_url = 'mst_info_base.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//General ba recharge deposit
function RechargeManage(token, base_amount, suc_func, error_func) {
    var api_url = 'ba_recharge_quest.php',
        post_data = {
            'token': token,
            'base_amount': base_amount
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//General baWithdrawal margin
function WithdrawManage(token, base_amount, fun_pass, suc_func, error_func) {
    var api_url = 'ba_withdraw_quest.php',
        post_data = {
            'token': token,
            'base_amount': base_amount,
            'fun_pass': fun_pass
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//modify ba nickname
function ModifyNickName(token, ba_account, suc_func, error_func) {
    var api_url = 'alter_ba_account.php',
        post_data = {
            'token': token,
            'ba_account': ba_account
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//get ba bind information
function GetBindInformation(token, suc_func, error_func) {
    var api_url = 'mst_info_bind.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//Google binding
function GoogleBind(token, email, suc_func, error_func) {
    var api_url = 'bnd_Google.php',
        post_data = {
            'token': token,
            'email': email
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Google verification
function GoogleVerify(token, code, suc_func, error_func) {
    var api_url = 'cfm_Google.php',
        post_data = {
            'token': token,
            'code': code
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Text binding
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

// Text modification
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

//get la_id
function GetLaId(token, suc_func, error_func) {
    var api_url = 'get_la_admin_info.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

// File binding
function FileBind(token, file_type, file_url, suc_func, error_func) {
    var api_url = 'bnd_file.php',
        post_data = {
            'token': token,
            'file_type': file_type,
            'file_url': file_url
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//hash binding
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

//Account change record/Login record query
function ChangeCode(token, limit, offset, api_url, suc_func, error_func) {
    // var api_url = 'log_balance.php',
    var post_data = {
        'token': token,
        'limit': limit,
        'offset': offset
    };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Get Margin Recharge Address/GetMarginWithdrawAddress
function GetMarginAddress(token, suc_func, error_func) {
    var api_url = 'get_bit_address_recharge.php',
        post_data = {
            'token': token
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//Add margin recharge address
function AddMarginRechargeAddress(token, bit_address, suc_func, error_func) {
    var api_url = 'bit_address_recharge_add.php',
        post_data = {
            'token': token,
            'bit_address': bit_address
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//Get the margin withdrawal address
function GetMarginWithdrawAddress(token, suc_func, error_func) {
    var api_url = 'get_bit_address_withdraw.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Add margin withdrawal address
function AddMarginWithdrawAddress(token, bit_address, fun_pass, suc_func, error_func) {
    var api_url = 'bit_address_withdraw_add.php',
        post_data = {
            'token': token,
            'bit_address': bit_address,
            'fun_pass': fun_pass
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Margin recharge pending list
function GetMarginRechargePending(token, type, suc_func, error_func) {
    var api_url = 'log_base_recharge.php',
        post_data = {
            'token': token,
            'type': type
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//Confirm processing margin recharge
function MarginRechargeConfirm(token, type, qa_id, suc_func, error_func) {
    var api_url = 'base_recharge_confirm.php',
        post_data = {
            'token': token,
            'type': type,
            'qa_id': qa_id
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//Margin recharge has been processed
function GetRechargeAlready(token, suc_func, error_func) {
    var api_url = '',
        post_data = {
            'token': token
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//Margin withdrawal pending list
function GetMarginWithdrawPending(token, type, suc_func, error_func) {
    var api_url = 'log_base_withdraw.php',
        post_data = {
            'token': token,
            'type': type
        };
    CallLaBase(api_url, post_data, suc_func, error_func);
}

//Confirm processing margin withdrawal
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

//Login record query
// function LoginRecordQuery(token, limit, offset, suc_func, error_func){
//     var api_url = 'log_login.php',
//         post_data = {
//             'token': token,
//             'limit': limit,
//             'offset': offset
//         };
//     CallApi(api_url, post_data, suc_func, error_func);
// };
//Recharge exchange rate setting
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

//Get recharge rate
function GetRechargeRate(token, suc_func, error_func) {
    var api_url = 'get_recharge_rate.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//withtraw exchange rate setting
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

//Get the withdrawal rate
function GetWithdrawRate(token, suc_func, error_func) {
    var api_url = 'get_withdraw_rate.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//add address
function AddAddress(token, bit_address, is_void, suc_fun, error_fun) {
    var api_url = 'bit_address_add.php',
        post_data = {
            'token': token,
            'is_void': is_void,
            'bit_address': bit_address
        };
    CallApi(api_url, post_data, suc_fun, error_fun);
}

//Get the added address
function QueryAddress(token, limit, offset, suc_func, error_func) {
    var api_url = 'get_ba_asset_bit_account.php',
        post_data = {
            'token': token,
            'limit': limit,
            'offset': offset
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//Customer recharge request
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

//Customer withdrawal request
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

//Proxy user recharge withdrawal record query
function RechargeWithdrawCodeQuery(token, api_url, type, suc_func, error_func) {
    var post_data = {
        'token': token,
        'type': type
    };
    CallApi(api_url, post_data, suc_func, error_func);
};

//Recharge request confirmation processing
function RechargeConfirm(token, qa_id, type, suc_func, error_func) {
    var api_url = 'recharge_confirm.php',
        post_data = {
            'token': token,
            'type': type,
            'qa_id': qa_id
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//Withdrawal request confirmation processing
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

//get ba
function GetBaItem(api_url, token, bit_type, suc_func, error_func) {
    var post_data = {
        'token': token,
        'bit_type': bit_type
    };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Lock recharge amount submission
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

//Lock withdrawal request
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

//Login failure countdown
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

//Get phone verification code
function BaGetPhoneCode(cellphone, country_code, bind_type, suc_func, error_func) {
    var api_url = 'sms_send.php',
        post_data = {
            'cellphone': cellphone,
            'country_code': country_code,
            'bind_type': bind_type
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
}

//get user base information
function GetUserBaseInfo(token, suc_func, error_func) {
    var api_url = 'info_base.php',
        post_data = {
            'token': token
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
}

//check user bind information
function CheckUserBindInfo(token, suc_func, error_func) {
    var api_url = 'info_bind.php',
        post_data = {
            'token': token
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
}

//userAdd withdrawal address
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

//User withdrawal order details
function GetWithdrawInfo(token, suc_func, error_func) {
    var api_url = 'order_ba_withdraw_list.php',
        post_data = {
            'token': token
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
}

//Verify the fund password
function CfmFundPass(token, cfm_fundPass, suc_func, error_func) {
    var api_url = 'cfm_fundpass.php',
        post_data = {
            'token': token,
            'cfm_fundPass': cfm_fundPass
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
};

//Verify mobile phone SMS code
function CfmPhone(sms_code, country_code, cellphone, suc_func, error_func) {
    var api_url = 'cfm_phone.php',
        post_data = {
            'sms_code': sms_code,
            'country_code': country_code,
            'cellphone': cellphone
        };
    CallUserApi(api_url, post_data, suc_func, error_func);
}

//get key code
function GetKeyCode(token, suc_func, error_func) {
    var api_url = 'get_key_code.php',
        post_data = {
            'token': token
        };
    CallLaConfigApi(api_url, post_data, suc_func, error_func);
}

/**
 * Disable button
 * @param $this Button object
 * @param btnText Button text content defaults to "in process"
 * @return {boolean}
 */
function DisableClick($this, btnText) {
    if (!$this) {
        // console.warn("$this Can not be empty");
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
 * Activation button
 * @param $this Button object
 * @param btnText Button text content defaults to "in process"
 */
function ActiveClick($this, btnText) {
    if (!$this) {
        console.warn("$this Can not be empty");
        return;
    }
    btnText = btnText ? btnText : "confirm";
    $this.attr('data-clickStatus', 1);
    $this.html(btnText);
}

/**
 * Initialization page loading loading
 * */
window.onload = function () {
    if (document.readyState === 'complete') {
        document.body.style.overflow = "auto";
        var loading = document.querySelector(".loading");
        loading.parentNode.removeChild(loading);
    }
};
$('[data-toggle="tooltip"]').tooltip()
