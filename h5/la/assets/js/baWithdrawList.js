$(function () {
    //获取token
    var token = GetCookie('la_token');

    //获取ba交易记录
    var tr = '', ba_id_arr = [], us_id_arr = [], tx_hash_arr = [], qa_flag_span = '';
    GetBaTransaction(token, function (response) {
        if(response.errcode == '0'){
            var withdrawList = response.rows.recharge;
            $.each(withdrawList, function (i, val) {
                ba_id_arr.push(withdrawList[i].ba_id.substring(0,10) + '...');
                us_id_arr.push(withdrawList[i].us_id.substring(0,10) + '...');
                tx_hash_arr.push(withdrawList[i].tx_hash.substring(0,10) + '...');
                if (withdrawList[i].qa_flag == '0') {
                    qa_flag_span = '<span class="i18n" name="unprocessed">未处理</span>';
                }
                if (withdrawList[i].qa_flag == '1') {
                    qa_flag_span = '<span class="i18n" name="processed">已处理</span>';
                }
                if (withdrawList[i].qa_flag == '2') {
                    qa_flag_span = '<span class="i18n" name="notRejected">已拒绝</span>';
                }
                tr+='<tr>' +
                    '<td><a href="javascript:;" class="ba_id" title="'+ withdrawList[i].ba_id +'">'+ ba_id_arr[i] +'</a></td>' +
                    '<td><a href="javascript:;" class="us_id" title="'+ withdrawList[i].us_id +'">'+ us_id_arr[i] +'</a></td>' +
                    '<td><span class="asset_id">'+ withdrawList[i].asset_id +'</span></td>' +
                    '<td><span class="base_amount">'+ withdrawList[i].base_amount +'</span></td>' +
                    '<td><span class="bit_amount">'+ withdrawList[i].bit_amount +'</span></td>' +
                    '<td><span class="tx_hash" title="'+ withdrawList[i].tx_hash +'">'+ tx_hash_arr[i] +'</span></td>' +
                    '<td><span class="tx_time">'+ withdrawList[i].tx_time +'</span></td>' +
                    '<td><span class="qa_flag">'+ qa_flag_span +'</span></td>' +
                    '</tr>'
            });
            $('#baWithdraw').html(tr);
            execI18n();
        }
    }, function (response) {
        GetErrorCode(response.errcode);
        return;
    });

    //进入ba详情
    $(document).on('click', '.ba_id', function () {
        var ba_id = $(this).attr('title');
        window.location.href = 'baInfo.html?ba_id=' + ba_id;
    });
    //进入user详情
    $(document).on('click', '.us_id', function () {
        var us_id = $(this).attr('title');
        window.location.href = 'userInfo.html?us_id=' + us_id;
    });

    //条件筛选
    $("input[type=checkbox]").click(function () {
        var className = $(this).val();
        if ($(this).prop('checked')) {
            $('.' + className).fadeIn();
            $('.' + className).children('div').css('display', 'flex');
        } else {
            $('.' + className).fadeOut();
        }
    });

    //点击搜索按钮进行筛选
    $('.searchBtn').click(function () {
        var from_time = $('#from_time').val(), to_time = $('#to_time').val(), tx_time = $('#tx_time').val(),
            qa_id = $('#qa_id').val(), us_id = $('#us_id').val(), us_account_id = $('#us_account_id').val(),
            asset_id = $('#asset_id').val(), ba_account_id = $('#ba_account_id').val(), tx_hash = $('#tx_hash').val(),
            base_amount = $('#base_amount').val(), bit_amount = $('#bit_amount').val(), tx_detail = $('#tx_detail').val(),
            tx_fee = $('#tx_fee').val(), tx_type = $('#tx_type').val(), qa_flag = $('#qa_flag').val(),
            ba_id = $('#ba_id').val();
        SearchBaTransaction(from_time, to_time, tx_time, qa_id, us_id, us_account_id, asset_id, ba_account_id, tx_hash,
            base_amount, bit_amount, tx_detail, tx_fee, tx_type, qa_flag, ba_id, function (response) {
                if(response.errcode == '0'){
                    console.log(response);
                }
            }, function (response) {
                GetErrorCode(response.errcode);
                return;
            })
    });

    //设置开始时间
    $('#from_time').datetimepicker({
        format: 'Y/m/d H:i',
        value: new Date(),
        // minDate: new Date(),//设置最小日期
        // minTime: new Date(),//设置最小时间
        // yearStart: 2018,//设置最小年份
        yearEnd: 2050 //设置最大年份
    });
    //设置结束时间
    $('#to_time, #tx_time').datetimepicker({
        format: 'Y/m/d H:i',
        value: new Date(),
        // minDate: new Date(),//设置最小日期
        // minTime: new Date(),//设置最小时间
        // yearStart: 2018,//设置最小年份
        yearEnd: 2050 //设置最大年份
    });
});