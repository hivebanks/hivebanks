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
    if (arr == null) {
        window.location.href = 'login.html';
        return null;
    }
}

// Delete cookie function
function DelCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = GetCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ';path=/';
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
            if (response[i].code_key == code) {
                layer.msg('<p class="i18n" name="' + code + '">' + response[i].code_value + '</p>');
                execI18n();
                return;
            }
        })
    })
}

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
        $('.base_currency').text(benchmark_type);
        if (!userLanguage) {
            SetCookie('userLanguage', data.userLanguage);
        } else {
            return;
        }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {

    }
});

// 调用API LA配置函数
function CallLaConfigApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/api/la/admin/configure/';
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

// 调用API LA函数
function CallLaInfoApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/api/la/';
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

// 调用API 报表函数
function CallReportApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/api/la/admin/report_form/';
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

// 调用API管理函数
function CallApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/api/la/admin/manage/';
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

// 调用API Admin函数
function CallLaAdminApi(api_url, post_data, suc_func, error_func) {
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

// 调用API查询交易共通函数
function CallTransactionApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/api/la/admin/transaction/';
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

// 调用API查询KYC审核列表函数
function CallKycApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/api/la/admin/kyc/';
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

//获取us/ba/ca注册权限
function GetSwitch(token, suc_func, error_func) {
    var api_url = 'reg_list.php',
        post_data = {
            'token': token
        };
    CallLaAdminApi(api_url, post_data, suc_func, error_func);
}

//设置us/ba/ca注册权限
function SetSwitch(token, type, status, suc_func, error_func) {
    var api_url = 'reg_switch.php',
        post_data = {
            'token': token,
            'type': type,
            'status': status
        };
    CallLaAdminApi(api_url, post_data, suc_func, error_func);
}

//get la_id
function GetLaId(token, suc_func, error_func) {
    var api_url = 'get_la_admin_info.php',
        post_data = {
            'token': token
        };
    CallLaConfigApi(api_url, post_data, suc_func, error_func);
}

//获取短信接口
function GetSmsInterface(token, suc_func, error_func) {
    var api_url = 'get_sms_config.php',
        post_data = {
            'token': token
        };
    CallLaConfigApi(api_url, post_data, suc_func, error_func);
}

//设置短信接口
function SetSmsInterface(token, accessKeyId, accessKeySecret, SignName, TemplateCode, suc_func, error_func) {
    var api_url = 'set_sms_config.php',
        post_data = {
            'token': token,
            'accessKeyId': accessKeyId,
            'accessKeySecret': accessKeySecret,
            'SignName': SignName,
            'TemplateCode': TemplateCode
        };
    CallLaConfigApi(api_url, post_data, suc_func, error_func);
}

//获取邮箱接口
function GetEmailInterface(token, suc_func, error_func) {
    var api_url = 'get_email_config.php',
        post_data = {
            'token': token
        };
    CallLaConfigApi(api_url, post_data, suc_func, error_func);
}

//设置邮箱接口
function SetEmailInterface(token, Host, Username, Password, address, name, suc_func, error_func) {
    var api_url = 'set_email_config.php',
        post_data = {
            'token': token,
            'Host': Host,
            'Username': Username,
            'Password': Password,
            'address': address,
            'name': name
        };
    CallLaConfigApi(api_url, post_data, suc_func, error_func);
}

//获取错误码列表
function GetErrorList(token, suc_func, error_func) {
    var api_url = 'get_error_code_config.php',
        post_data = {
            'token': token
        };
    CallLaConfigApi(api_url, post_data, suc_func, error_func);
}

//修改错误码信息
function SetErrorMsg(token, code_key, code_value, suc_func, error_func) {
    var api_url = 'set_error_code_config.php',
        post_data = {
            'token': token,
            'code_key': code_key,
            'code_value': code_value
        };
    CallLaConfigApi(api_url, post_data, suc_func, error_func);
}

//LA_LOGIN
function LaLogin(user, password, pass_word_hash, suc_func, error_func) {
    var api_url = 'login.php',
        post_data = {
            'user': user,
            'password': password,
            'pass_word_hash': pass_word_hash
        };
    CallLaAdminApi(api_url, post_data, suc_func, error_func);
}

//修改密码
function ForgetPassword(email, user, suc_func, error_func) {
    var api_url = 'admin_password_reset.php',
        post_data = {
            'email': email,
            'user': user
        };
    CallLaAdminApi(api_url, post_data, suc_func, error_func);
}

//配置api_key
function SetApiKey(token, api_key, suc_func, error_func) {
    var api_url = 'set_configure_key.php',
        post_data = {
            'token': token,
            'api_key': api_key
        };
    CallLaConfigApi(api_url, post_data, suc_func, error_func);
}

//获取la基本信息
function GetLaBaseInfo(token, suc_func, error_func) {
    var api_url = 'get_la_base_info.php',
        post_data = {
            'token': token
        };
    CallLaInfoApi(api_url, post_data, suc_func, error_func);
}

//获取user/ba/ca列表
function GetUserList(token, api_url, limit, offset, suc_func, error_func) {
    var post_data = {
        'token': token,
        'limit': limit,
        'offset': offset
    };
    CallApi(api_url, post_data, suc_func, error_func);
}

//获取user信息
function GetUserInfo(us_id, suc_func, error_func) {
    var api_url = 'user_list_detail_message.php',
        post_data = {
            'us_id': us_id
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//获取ba信息
function GetBaInfo(ba_id, suc_func, error_func) {
    var api_url = 'ba_list_detail_message.php',
        post_data = {
            'ba_id': ba_id
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//设置ba保证金
function ReviseBaAmount(token, ba_id, base_amount, pass_word_hash, suc_func, error_func) {
    var api_url = 'ba_bail.php',
        post_data = {
            'token': token,
            'ba_id': ba_id,
            'base_amount': base_amount,
            'pass_word_hash': pass_word_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//设置ca保证金
function ReviseCaAmount(token, ca_id, base_amount, pass_word_hash, suc_func, error_func) {
    var api_url = 'ca_bail.php',
        post_data = {
            'token': token,
            'ca_id': ca_id,
            'base_amount': base_amount,
            'pass_word_hash': pass_word_hash
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//获取ca信息
function GetCaInfo(ca_id, suc_func, error_func) {
    var api_url = 'ca_list_detail_message.php',
        post_data = {
            'ca_id': ca_id
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//设置user黑名单
function SetBlackList(us_id, type, black_info, limt_time, suc_func, error_func) {
    var api_url = 'set_user_black_list.php',
        post_data = {
            'us_id': us_id,
            'type': type,
            'black_info': black_info,
            'limt_time': limt_time,
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//获取黑名单列表
function GetBlackList(us_id, suc_func, error_func) {
    var api_url = 'get_black_list_info.php',
        post_data = {
            'us_id': us_id
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//获取ba ALL交易记录
function GetBaTransaction(token, suc_func, error_func) {
    var api_url = 'ba_transaction.php',
        post_data = {
            'token': token
        };
    CallTransactionApi(api_url, post_data, suc_func, error_func);
}

//筛选ba交易记录
function SearchBaTransaction(token, from_time, to_time, tx_time, qa_id, us_id, us_account_id, asset_id, ba_account_id, tx_hash,
                             base_amount, bit_amount, tx_detail, tx_fee, tx_type, qa_flag, ba_id, suc_func, error_func) {
    var api_url = 'transaction_select_ba.php',
        post_data = {
            'token': token,
            'from_time': from_time, 'to_time': to_time, 'tx_time': tx_time, 'qa_id': qa_id, 'us_id': us_id,
            'us_account_id': us_account_id, 'asset_id': asset_id, 'ba_account_id': ba_account_id,
            'tx_hash': tx_hash, 'base_amount': base_amount, 'bit_amount': bit_amount, 'tx_detail': tx_detail,
            'tx_fee': tx_fee, 'tx_type': tx_type, 'qa_flag': qa_flag, 'ba_id': ba_id,
        };
    CallTransactionApi(api_url, post_data, suc_func, error_func);
}

//筛选ca交易记录
function SearchCaTransaction(from_time, to_time, tx_time, qa_id, us_id, us_account_id, asset_id, ba_account_id, tx_hash,
                             base_amount, bit_amount, tx_detail, tx_fee, tx_type, qa_flag, ba_id, suc_func, error_func) {
    var api_url = 'transaction_select_ca.php',
        post_data = {
            'from_time': from_time, 'to_time': to_time, 'tx_time': tx_time, 'qa_id': qa_id, 'us_id': us_id,
            'us_account_id': us_account_id, 'asset_id': asset_id, 'ba_account_id': ba_account_id,
            'tx_hash': tx_hash, 'base_amount': base_amount, 'bit_amount': bit_amount, 'tx_detail': tx_detail,
            'tx_fee': tx_fee, 'tx_type': tx_type, 'qa_flag': qa_flag, 'ba_id': ba_id,
        };
    CallTransactionApi(api_url, post_data, suc_func, error_func);
}

//获取ca ALL交易记录
function GetCaTransaction(token, suc_func, error_func) {
    var api_url = 'ca_transaction.php',
        post_data = {
            'token': token
        };
    CallTransactionApi(api_url, post_data, suc_func, error_func);
}

// user/ba/ca KYC绑定审核列表
function KycList(api_url, token, suc_func, error_func) {
    var post_data = {
        'token': token
    };
    CallKycApi(api_url, post_data, suc_func, error_func);
}

//确认绑定审核通过
function ConfirmKycUser(token, us_id, bind_name, bind_info, log_id, suc_func, error_func) {
    var api_url = 'kyc_user_confirm.php';
    var post_data = {
        'token': token,
        'us_id': us_id,
        'bind_name': bind_name,
        'bind_info': bind_info,
        'log_id': log_id
    };
    CallKycApi(api_url, post_data, suc_func, error_func);
}

//绑定审核拒绝
function RefuseKycUser(token, log_id, suc_func, error_func) {
    var api_url = 'kyc_user_refuse.php';
    var post_data = {
        'token': token,
        'log_id': log_id
    };
    CallKycApi(api_url, post_data, suc_func, error_func);
}


//绑定审核拒绝
function RefuseKycCa(token, log_id, suc_func, error_func) {
    var api_url = 'kyc_ca_refuse.php';
    var post_data = {
        'token': token,
        'log_id': log_id
    };
    CallKycApi(api_url, post_data, suc_func, error_func);
}


//ca绑定审核通过
function ConfirmKycCa(token, log_id, suc_func, error_func) {
    var api_url = 'kyc_ca_confirm.php';
    var post_data = {
        'token': token,
        'log_id': log_id
    };
    CallKycApi(api_url, post_data, suc_func, error_func);
}


//绑定审核拒绝
function RefuseKycBa(token, log_id, suc_func, error_func) {
    var api_url = 'kyc_ba_refuse.php';
    var post_data = {
        'token': token,
        'log_id': log_id
    };
    CallKycApi(api_url, post_data, suc_func, error_func);
}


//ba绑定审核通过
function ConfirmKycBa(token, log_id, suc_func, error_func) {
    var api_url = 'kyc_ba_confirm.php';
    var post_data = {
        'token': token,
        'log_id': log_id
    };
    CallKycApi(api_url, post_data, suc_func, error_func);
}

//获取ba/ca注册审核列表
function RegisterKyc(api_url, token, suc_func, error_func) {
    var post_data = {
        'token': token
    };
    CallKycApi(api_url, post_data, suc_func, error_func);
}

//通过ba/ca注册审核
function RegisterPass(api_url, token, bind_id, suc_func, error_func) {
    var post_data = {
        'token': token,
        'bind_id': bind_id
    };
    CallKycApi(api_url, post_data, suc_func, error_func);
}

//拒绝ba/ca注册审核
function RegisterRef(api_url, token, bind_id, suc_func, error_func) {
    var post_data = {
        'token': token,
        'bind_id': bind_id
    };
    CallKycApi(api_url, post_data, suc_func, error_func);
}

//获取一般ba/ca提现地址审核列表
function GetWithdrawAddressKyc(api_url, token, suc_func, error_func) {
    var post_data = {
        'token': token
    };
    CallKycApi(api_url, post_data, suc_func, error_func);
}

//确认通过-拒绝ba提现地址审核
function ConfirmBaWithdrawAddress(api_url, token, ba_id, bind_id, suc_func, error_func) {
    var post_data = {
        'token': token,
        'ba_id': ba_id,
        'bind_id': bind_id
    };
    CallKycApi(api_url, post_data, suc_func, error_func);
}

//确认通过-拒绝ca提现地址审核
function ConfirmCaWithdrawAddress(api_url, token, ca_id, bind_id, suc_func, error_func) {
    var post_data = {
        'token': token,
        'ca_id': ca_id,
        'bind_id': bind_id
    };
    CallKycApi(api_url, post_data, suc_func, error_func);
}

//获取故障申报列表
function GetDeclareList(token, is_deal, suc_func, error_func) {
    var api_url = 'kyc_feedback_list.php',
        post_data = {
            'token': token,
            'is_deal': is_deal
        };
    CallKycApi(api_url, post_data, suc_func, error_func);
}

//受理
function AcceptDeclareInfo(token, log_id, suc_func, error_func) {
    var api_url = 'kyc_feedback_accept.php',
        post_data = {
            'token': token,
            'log_id': log_id
        };
    CallKycApi(api_url, post_data, suc_func, error_func);
}

//处理
function ProcessDeclareInfo(token, log_id, deal_info, deal_name, suc_func, error_func) {
    var api_url = 'kyc_feedback_deal.php',
        post_data = {
            'token': token,
            'log_id': log_id,
            'deal_info': deal_info,
            'deal_name': deal_name
        };
    CallKycApi(api_url, post_data, suc_func, error_func);
}

//La配置
//设置管理员
function SetPermission(token, pid, real_name, pass_word_hash, user, suc_func, error_func) {
    var api_url = 'admin_add.php',
        post_data = {
            'token': token,
            'pid': pid,
            'real_name': real_name,
            'pass_word_hash': pass_word_hash,
            'user': user
        };
    CallLaAdminApi(api_url, post_data, suc_func, error_func);
}

//获取BA代理类型
function GetAgentType(api_url, token, suc_func, error_func) {
    var post_data = {
        'token': token
    };
    CallLaConfigApi(api_url, post_data, suc_func, error_func)
}

//设置BA代理类型
function SetAgentType(api_url, token, option_key, option_value, option_src, suc_func, error_func) {
    var post_data = {
        'token': token,
        'option_key': option_key,
        'option_value': option_value,
        'option_src': option_src
    };
    CallLaConfigApi(api_url, post_data, suc_func, error_func)
}

//删除BA代理类型DeleteBaType
function DeleteAgentType(api_url, token, option_key, suc_func, error_func) {
    var post_data = {
        'token': token,
        'option_key': option_key
    };
    CallLaConfigApi(api_url, post_data, suc_func, error_func)
}

//报表
function GetAssetsReport(token, suc_func, error_func) {
    var api_url = 'la_report_form.php',
        post_data = {
            'token': token
        };
    CallReportApi(api_url, post_data, suc_func, error_func);
}

/**
 * Disable button
 * @param $this Button object
 * @param btnText Button text content defaults to "in process"
 * @return {boolean}
 */
function DisableClick($this, btnText) {
    if (!$this) {
        console.warn("$this Can not be empty");
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