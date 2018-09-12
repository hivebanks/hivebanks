$(function () {
    //Get token
    var token = GetCookie('la_token');

    //Get ca transaction history
    var tr = '', ca_id_arr = [], us_id_arr = [], tx_hash_arr = [], qa_flag_span = '';
    function ShowDataFun (withdrawList){
        $.each(withdrawList, function (i, val) {
            ca_id_arr.push(withdrawList[i].ca_id.substring(0, 10) + '...');
            us_id_arr.push(withdrawList[i].us_id.substring(0, 10) + '...');
            tx_hash_arr.push(withdrawList[i].tx_hash.substring(0, 10) + '...');
            if (withdrawList[i].qa_flag == '0') {
                qa_flag_span = '<span class="i18n" name="unprocessed"></span>';
            }
            if (withdrawList[i].qa_flag == '1') {
                qa_flag_span = '<span class="i18n" name="processed"></span>';
            }
            if (withdrawList[i].qa_flag == '2') {
                qa_flag_span = '<span class="i18n" name="notRejected"></span>';
            }
            tr += '<tr>' +
                '<td><a href="javascript:;" class="ca_id" title="' + withdrawList[i].ca_id + '">' + ca_id_arr[i] + '</a></td>' +
                '<td><a href="javascript:;" class="us_id" title="' + withdrawList[i].us_id + '">' + us_id_arr[i] + '</a></td>' +
                // '<td><span class="asset_id">'+ withdrawList[i].asset_id +'</span></td>' +
                '<td><span class="base_amount">' + withdrawList[i].base_amount + '</span></td>' +
                // '<td><span class="bit_amount">'+ withdrawList[i].bit_amount +'</span></td>' +
                '<td><span class="tx_hash" title="' + withdrawList[i].tx_hash + '">' + tx_hash_arr[i] + '</span></td>' +
                '<td><span class="tx_time">' + withdrawList[i].tx_time + '</span></td>' +
                '<td><span class="qa_flag">' + qa_flag_span + '</span></td>' +
                '</tr>'
        });
        $('#caWithdraw').html(tr);
        execI18n();
    }
    GetCaTransaction(token, function (response) {
        if (response.errcode == '0') {
            var withdrawList = response.rows.withdraw;
            if (withdrawList == false) {
                GetDataEmpty('baWithdraw', '8');
                return;
            }
            ShowDataFun(withdrawList);
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //Jump ca details
    $(document).on('click', '.ca_id', function () {
        var ca_id = $(this).attr('title');
        window.location.href = 'caInfo.html?ca_id=' + ca_id;
    });
    //Jump user details
    $(document).on('click', '.us_id', function () {
        var us_id = $(this).attr('title');
        window.location.href = 'userInfo.html?us_id=' + us_id;
    });

    //Conditional screening
    $("input[type=checkbox]").click(function () {
        var className = $(this).val();
        if ($(this).prop('checked')) {
            $('.' + className).fadeIn();
            $('.' + className).children('div').css('display', 'flex');
        } else {
            $('.' + className).fadeOut();
        }
    });

    //Click the search button to filter
    $('.searchBtn').click(function () {
        var from_time = "", to_time = "", tx_time = "";

        if ($('.from_time').hasClass('none')) {
            from_time = "";
        } else {
            from_time = $('#from_time').val()
        }
        if ($('.to_time').hasClass('none')) {
            to_time = "";
        } else {
            to_time = $('#to_time').val()
        }
        if ($('.tx_time').hasClass('none')) {
            tx_time = "";
        } else {
            tx_time = $('#tx_time').val()
        }
        var qa_id = $('#qa_id').val(), us_id = $('#us_id').val(), us_account_id = $('#us_account_id').val(),
            asset_id = $('#asset_id').val(), ba_account_id = $('#ba_account_id').val(), tx_hash = $('#tx_hash').val(),
            base_amount = $('#base_amount').val(), bit_amount = $('#bit_amount').val(),
            tx_detail = $('#tx_detail').val(),
            tx_fee = $('#tx_fee').val(), tx_type = $('#tx_type').val(), qa_flag = $('#qa_flag').val(),
            ba_id = $('#ba_id').val();
        $(".preloader-wrapper").addClass("active");
        SearchBaTransaction(from_time, to_time, tx_time, qa_id, us_id, us_account_id, asset_id, ba_account_id, tx_hash,
            base_amount, bit_amount, tx_detail, tx_fee, tx_type, qa_flag, ba_id, function (response) {
                if (response.errcode == '0') {
                    $(".preloader-wrapper").removeClass("active");
                    var withdrawList = response.rows.withdraw;
                    if (withdrawList == false) {
                        GetDataEmpty('baWithdraw', '8');
                        return;
                    }
                    ShowDataFun(withdrawList);
                }
            }, function (response) {
                $(".preloader-wrapper").removeClass("active");
                LayerFun(response.errcode);
                return;
            })
    });

    //Set start time
    $('#from_time').datetimepicker({
        format: 'Y/m/d H:i',
        value: new Date(),
        // minDate: new Date(),//Set minimum date
        // minTime: new Date(),//Set minimum time
        // yearStart: 2018,//Set the minimum year
        yearEnd: 3000 //Set the maximum year
    });

    //Set end time
    $('#to_time, #tx_time').datetimepicker({
        format: 'Y/m/d H:i',
        value: new Date(),
        // minDate: new Date(),//Set minimum date
        // minTime: new Date(),//Set minimum time
        // yearStart: 2018,//Set the minimum year
        yearEnd: 3000 //Set the maximum year
    });
});