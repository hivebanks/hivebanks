$(function () {
   //get token
   var token = GetCookie('ba_token');
    GetBaAccount();

    // get Basic user information
    GetBasicInformation(token, function (response) {
        if (response.errcode == '0') {
            $('.bit_type').text(response.bit_type);
            $('.base_amount').text(response.base_amount);
            $('.lock_amount').text(response.lock_amount);
        }
    }, function (response) {
        return;
    });

   //Get margin recharge pending
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
                    '<span class="i18n" name="handle">handle</span>' +
                    '</a>' +
                    '<span class="qa_id none">' + data[i].qa_id + '</span>' +
                    '</td>' +
                    '</tr>'
            });
            $('#marginRechargePendingTable').html(tr);
        }
    }, function (response) {
        GetDataFail('marginRechargePendingTable', '4');
        LayerFun(response.errcode);
        return;
    });

    //Confirm processing margin recharge
    $(document).on('click', '.confirmBtn', function () {
        var type = '1', qa_id = $(this).parents('.marginRechargeItem').find('.qa_id').text();
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        MarginRechargeConfirm(token, type, qa_id, function (response) {
            if(response.errcode == '0'){
                ShowLoading("hide");
                ActiveClick($this, btnText);
                LayerFun("suc_processing");
                $this.closest('.marginRechargeItem').remove();
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun("err_processing");
        })
    })
});