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

//Get data failure prompt
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

//Get configuration file/Base currency type
var config_api_url = '', config_h5_url = '', userLanguage = getCookie('userLanguage');
    $.ajax({
        url: url+"/h5/assets/json/config_url.json",
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
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

// Call API common function
function CallApi(api_url, post_data, suc_func, error_func) {
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
}

// Call Ba API common function
function CallBaApi(api_url, post_data, suc_func, error_func) {
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
}

// Call Ca API common function
function CallCaApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/src/ca/';
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

// Call the API news function
function CallNewsApi(api_url, post_data, suc_func, error_func) {
    var api_site = config_api_url + '/src/news/';
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

//Check if registration is allowed
function RegisterSwitch(type, suc_func, error_func) {
    var api_url = 'reg_lock.php',
        post_data = {
            'type' : type
        };
    CallLaApi(api_url, post_data, suc_func, error_func);
}

//Get graphic verification code
function GetImgCode() {
    var src = config_api_url + '/src/inc/code.php';
    $('#email_imgCode').attr("src", src);
    $('#phone_imgCode').attr("src", src);
}

// email registration
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

//Mobile phone registration processing
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

//Mailbox login processing
function EmailLogin(email, pass_word_hash, cfm_code, suc_func, error_func) {
    var api_url = 'lgn_email.php',
        post_data = {
            'email': email,
            'pass_word_hash': pass_word_hash,
            'cfm_code': cfm_code
    };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Mobile phone login processing
function PhoneLogin(country_code, cellphone, pass_word_hash, cfm_code, suc_func, error_func) {
    var api_url = 'lgn_phone.php',
        post_data = {
            'country_code': country_code,
            'cellphone': cellphone,
            'pass_word_hash': pass_word_hash,
            'cfm_code': cfm_code
        };
    CallApi(api_url, post_data, suc_func, error_func);
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

//Reset Email Password--Get Email Authentication Code
function GetEmailCode(email, suc_func, error_func) {
    var api_url = 'cfm_email_preform.php',
        post_data = {
            'email': email
        };
    CallApi(api_url, post_data, suc_func, error_func)
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

// Get user binding information
function BindingInformation(token, suc_func, error_func) {
    var api_url = 'info_bind.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

//Modify user nickname
function ModifyNickName(token, us_account, suc_func, error_func) {
    var api_url = 'alter_us_account.php',
        post_data = {
            'token': token,
            'us_account': us_account
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

// user information
function UserInformation(token, suc_func, error_func) {
    var api_url = 'info_base.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
};

// User Change Record - Login Record - Transfer - BA / CA - Recharge / Withdrawal - Record
function AllRecord(token, limit, offset, api_url, suc_func, error_func) {
    var post_data = {
        'token': token,
        'limit': limit,
        'offset': offset
    };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Get order transaction status
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

// Text binding
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

//Google binding
function GoogleBind(token, email, suc_func, error_func) {
    var api_url = 'bnd_Google.php',
        post_data = {
            'token' : token,
            'email' : email
        };
        CallApi(api_url, post_data, suc_func, error_func);
}

//Google verification
function GoogleVerify(token, code, suc_func, error_func) {
    var api_url = 'cfm_Google.php',
        post_data = {
            'token' : token,
            'code' : code
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//get ba recharge withdraw recode
function GetBaRateList(api_url, token, suc_func, error_func) {
    var post_data = {
        'token': token
    };
    CallBaApi(api_url, post_data, suc_func, error_func);
}

//Get the average value of the CA recharge cash withdrawal rate
function GetAverageRate(api_url, token, suc_func, error_func) {
    var post_data = {
        'token': token
    };
    CallCaApi(api_url, post_data, suc_func, error_func);
}

//get phone code
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

//Get the declaration list
function GetFaultReportList(token, suc_func, error_func) {
    var api_url = 'feedback_list.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Submit a failure report
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

//Get the list of bank cards that users need to add
function GetBankList(token, suc_func, error_func) {
    var api_url = 'us_channel_list.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func)
}

//Confirm adding a bank card
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

//Get the list of added bank cards
function GetAddBankList(token, suc_func, error_func) {
    var api_url = 'get_bank_card_list.php',
        post_data = {
            'token': token
        };
    CallApi(api_url, post_data, suc_func, error_func);
}

//Delete the bound bank card
function DeleteBank(token, account_id, suc_func, error_func) {
    var api_url = 'del_us_bank_card.php',
        post_data = {
            'token': token,
            'account_id': account_id
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
        return;
    }
    ;
    setTimeout(function () {
        CountDown(counts, ErrorNum, LoginBtn, input, LoginError)
    }, 1000)
};

//get key code
function GetKeyCode(token, suc_func, error_func) {
    var api_url = 'get_key_code.php',
        post_data = {
            'token': token
        };
    CallLaConfigApi(api_url, post_data, suc_func, error_func);
}

//get news list
function Get_News_List(suc_func, error_func) {
    var api_url = 'news_list.php',
        post_data = {};
    CallNewsApi(api_url, post_data, suc_func, error_func);
}

//get news info
function GetNewsInfo(news_id, suc_func, error_func) {
    var api_url = 'news_detail.php',
        post_data = {
        "news_id" : news_id
        };
    CallNewsApi(api_url, post_data, suc_func, error_func);
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
    btnText = btnText ? btnText : "确认";
    $this.attr('data-clickStatus', 1);
    $this.html(btnText);
}

/**
 * Initialization page loading loading
 */
window.onload = function () {
    if (document.readyState === 'complete') {
        document.body.style.overflow = "auto";
        var loading = document.querySelector(".loading");
        loading.parentNode.removeChild(loading);
    }
};
$('[data-toggle="tooltip"]').tooltip()
