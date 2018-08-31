$(function () {
   //获取token
   var token = GetCookie('ba_token');
    GetBaAccount();

    // 获取用户基本信息
    GetBasicInformation(token, function (response) {
        if (response.errcode == '0') {
            $('.bit_type').text(response.bit_type);
            $('.base_amount').text(response.base_amount);
            $('.lock_amount').text(response.lock_amount);
        }
    }, function (response) {
        return;
    });

   //获取保证金充值待处理
    var type = '1', tr = '';
    GetMarginRechargePending(token, type, function (response) {
        if(response.errcode == '0'){
            var data = response.rows;
            if(data == false){
                GetDataEmpty('marginRechargePendingTable', '4');
                return;
            }
            $.each(data, function (i, val) {
                tr+='<tr class="marginRechargeItem">' +
                    '<td>'+ data[i].agent_id +'</td>' +
                    '<td>'+ data[i].base_amount +'</td>' +
                    '<td>'+ data[i].bit_address +'</td>' +
                    '<td>'+ data[i].tx_time +'</td>' +
                    '<td>' +
                    '<a class="btn btn-success btn-sm confirmBtn">' +
                    '<span class="i18n" name="confirmations">Confirmations</span>' +
                    '</a>' +
                    '<span class="qa_id none">' + data[i].qa_id + '</span>' +
                    '</td>' +
                    '</tr>'
            });
            $('#marginRechargePendingTable').html(tr);
        }
    }, function (response) {
        GetDataFail('marginRechargePendingTable', '4');
        GetErrorCode(response.errcode);
        return;
    });

    //确认处理保证金充值
    $(document).on('click', '.confirmBtn', function () {
        var type = '1', qa_id = $(this).parents('.marginRechargeItem').find('.qa_id').text();
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        MarginRechargeConfirm(token, type, qa_id, function (response) {
            if(response.errcode == '0'){
                ActiveClick($this, btnText);
                $this.closest('.marginRechargeItem').remove();
            }
        }, function (response) {
            ActiveClick($this, btnText);
            GetErrorCode(response.errcode);
        })
    })
});