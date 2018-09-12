$(function () {
    //get token
    var token = GetCookie('user_token');
    GetUsAccount();

    // Basic user information
    var submit_name = '';
    UserInformation(token, function (response) {
        if (response.errcode == '0') {
            submit_name = response.rows.us_account;
        }
    }, function (response) {
        if (response.errcode == '114') {
            window.location.href = 'login.html';
        }
    });

    //Get the declaration list
    var _li = '';
    function FaultProcess(submit_info, log_status) {

        if(log_status == 'unProcessed' || log_status == 'processing'){
            _li = '<li class="margin-bottom-2 faultLi">' +
                '<p>' +
                '<span class="font-weight-400 i18n" name="declarationInformation">Declaration Information</span>:' +
                '<span class="BackFaultReportInfo margin-left-1">'+ submit_info +'</span>' +
                '</p>' +
                '<p>' +
                '<span class="font-weight-400 i18n" name="currentProgress">Current Progress</span>:' +
                '<span class="i18n margin-left-1" name="'+ log_status +'"></span>' +
                '</p>' +
                '</li>';
        }
        $('.faultReportList').append(_li);
        execI18n();
    }
    function GetFaultReportFun() {
        GetFaultReportList(token, function (response) {
            if (response.errcode == '0') {
                var data = response.rows, li = '';
                if (data == false) {
                    $('.noInformation').show();
                }
                $.each(data, function (i, val) {
                    if(data[i].log_status == '0'){
                        var log_status = 'unProcessed',
                            submit_info = data[i].submit_info;
                        FaultProcess(submit_info, log_status);
                    }else if(data[i].log_status == '9'){
                        var log_status = 'processed';
                            li += '<li class="margin-bottom-2 faultLi">' +
                                '<p>' +
                                '<span class="font-weight-400 i18n" name="declarationInformation">Declaration Information</span>:' +
                                '<span class="BackFaultReportInfo margin-left-1">'+ data[i].submit_info +'</span>' +
                                '</p>' +
                                '<p>' +
                                '<span class="font-weight-400 i18n" name="currentProgress">Current Progress</span>:' +
                                '<span class="i18n margin-left-1" name="'+ log_status +'"></span>' +
                                '</p>' +
                                '<p>' +
                                '<span class="font-weight-400 i18n" name="processingTime">Processing Time</span>:' +
                                '<span class="margin-left-1">'+ data[i].deal_time +'</span>' +
                                '</p>' +
                                '<p>' +
                                '<span class="font-weight-400 i18n" name="processor">Processing person</span>' +
                                '<span class="margin-left-1">'+ data[i].deal_name +'</span>' +
                                '</p>' +
                                '<p>' +
                                '<span class="font-weight-400 i18n" name="processingOpinions">Processing opinions</span>:' +
                                '<span class="margin-left-1">'+ data[i].deal_info +'</span>' +
                                '</p>' +
                                '</li>';
                        $('.faultReportList').append(li);
                        execI18n();
                    }else {
                        var log_status = 'processing',
                            submit_info = data[i].submit_info;
                        FaultProcess(submit_info, log_status);
                    }
                });
            }
        }, function (response) {
            if(response.errcode == '0'){
                window.location.href = 'login.html';
            }
            LayerFun(response.errcode);
            return;
        });
    }

    GetFaultReportFun();

    //Determine what device is on
    var end_type = GetUserAgent();

    var sub_id = 'us';
    $('.faultReportBtn').click(function () {
        var submit_info = $('#faultReportInfo').val();
        if (submit_info.length <= 0) {
            LayerFun('pleaseEnterFaultReportInfo');
            return;
        }
        ShowLoading("show");
        SubmitFaultReportInfo(token, sub_id, end_type, submit_name, submit_info, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                LayerFun('submitSuccess');
                GetFaultReportFun();
                $('.faultReportInfo').val('');
                return;
            }
        }, function (response) {
            ShowLoading("hide");
            if(response.errcode == '114'){
                window.location.href = 'login.html';
            }
            LayerFun(response.errcode);
            return;
        })
    })
});