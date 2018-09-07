$(function () {
    //get token
    var token = GetCookie('la_token');

    //Get the declaration list
    var limit = 0, offset = 10;

    function GetDeclareListFun(is_deal) {

        GetDeclareList(token, is_deal, function (response) {
            if (response.errcode == '0') {
                var data = response.rows, div = '', tr = '', li = '', dealLi = '';
                if (data == false) {
                    div = '<div><span class="i18n" name="noData"></span></div>';
                    $('.faultBox').html(div);
                    execI18n();
                    return;
                }

                $.each(data, function (i, val) {
                    if (is_deal == '2') {//未处理
                        dealLi == '';
                        li = '<li class="btnBox align-right">' +
                            '<span class="log_id none">' + data[i].log_id + '</span>' +
                            '<a href="javascript:;" class="i18n pendingAccept margin-right-2" name="pending">pending</a>' +
                            '<a href="javascript:;" class="i18n pendingProcess" name="pendingProcess">pendingProcess</a>' +
                            '</li>'
                    } else if (is_deal == '1') {//已处理
                        li = '';
                        dealLi = '<li>' +
                            '<span class="bold i18n" name="processInfo">Process Info</span>:' +
                            '<span>' + data[i].deal_info + '</span>' +
                            '</li>' +
                            '<li>' +
                            '<span class="bold i18n" name="deal_name">Deal Name</span>:' +
                            '<span>' + data[i].deal_name + '</span>' +
                            '</li>'
                    }
                    div += '<div class="faultItem margin-bottom-5">' +
                        '<ul class="flex center wrap">' +
                        '<li>' +
                        '<span class="i18n bold" name="submit_id"></span>:' +
                        '<span class="submit_id" name="">' + data[i].submit_id + '</span>' +
                        '</li>' +
                        '<li class="margin-left-5">' +
                        '<span class="i18n bold" name="submit_name"></span>:' +
                        '<span class="submit_name" name="">' + data[i].submit_name + '</span>' +
                        '</li>' +
                        '<li class="margin-left-5">' +
                        '<span class="i18n bold" name="end_type"></span>:' +
                        '<span class="end_type" name="">' + data[i].end_type + '</span>' +
                        '</li>' +
                        '<li class="margin-left-5">' +
                        '<span class="i18n bold" name="submit_time"></span>:' +
                        '<span class="submit_time" name="">' + data[i].submit_time + '</span>' +
                        '</li>' +
                        '</ul>' +
                        '<ul>' +
                        '<li><span class="i18n bold" name="submit_info"></span>:</li>' +
                        '<li><span class="submit_info" name="">' + data[i].submit_info + '</span></li>' +
                        li +
                        '</ul>' +
                        dealLi +
                        '</div>';
                });
                $('.faultBox').html(div);
                execI18n();
            }
        }, function (response) {
            GetDataFail('declareTable', '6');
            LayerFun(response.errcode);
            return;
        });
    }

    GetDeclareListFun('2');

    //未处理
    $('.unprocessed').click(function () {
        var is_deal = '2';
        $(this).addClass('activeBtn');
        $('.processed').removeClass('activeBtn');
        GetDeclareListFun(is_deal);
    });
    //已处理
    $('.processed').click(function () {
        var is_deal = '1';
        $(this).addClass('activeBtn');
        $('.unprocessed').removeClass('activeBtn');
        GetDeclareListFun(is_deal);
    });

    //点击待受理进行受理
    $(document).on('click', '.pendingAccept', function () {
        var _this = $(this), log_id = $(this).siblings('.log_id').text();
        AcceptDeclareInfo(token, log_id, function (response) {
            if (response.errcode == '0') {
                _this.attr('name', 'accepted');
                execI18n();
            }
        }, function (response) {
            LayerFun(response.errcode);
            return;
        });
    });

    //点击待处理进行受理
    var log_id = '', _this = '';
    $('.modal').modal();
    $(document).on('click', '.pendingProcess', function () {
        $('#processModal').modal('open');
        _this = $(this);
        log_id = $(this).siblings('.log_id').text();
    });

    //确认处理
    $('.confirmProcessBtn').click(function () {
        var deal_info = $('.deal_info').val();
        var deal_name = $('.deal_name').val();
        ProcessDeclareInfo(token, log_id, deal_info, deal_name, function (response) {
            if (response.errcode == '0') {
                LayerFun('successfulProcessing');
                GetDeclareListFun();
            }
        }, function (response) {
            LayerFun('processingFailure');
            LayerFun(response.errcode);
            return;
        });
    })
});