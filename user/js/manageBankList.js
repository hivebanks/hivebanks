$(function () {
    // token
    var token = GetCookie('user_token');
    GetUsAccount();

    //获取添加的银行卡列表
    GetAddBankList(token, function (response) {
        if(response.errcode == '0'){
            var data =response.rows, tr = '';
            if(data == false){
                GetDataEmpty('manageBankTable', '4');
                return;
            }
            $.each(data, function (i, val) {
                tr+='<tr class="bankItem">' +
                    '<td><span><i class="iconfont icon-'+ data[i].cash_channel.toLowerCase() +'"></i></span><span>'+ data[i].lgl_address.lgl_address +'</span></td>' +
                    '<td>'+ data[i].lgl_address.name +'</td>' +
                    '<td>'+ data[i].lgl_address.idNum +'</td>' +
                    '<td>'+ data[i].ctime +'</td>' +
                    '<td>' +
                    '<a href="javascript:;" class="delete btn btn-success btn-sm i18n" name="delete">删除</a>' +
                    '<span class="none account_id">'+ data[i].account_id +'</span>' +
                    '</td>' +
                    '</tr>'
            });
            $('#manageBankTable').html(tr);
            execI18n();
        }
    }, function (response) {
        if(response.errcode == '114'){
            window.location.href = 'login.html';
            return;
        }
        GetDataFail('manageBankTable', '4');
        GetErrorCode(response.errcode);
        return;
    });

    //删除绑定的银行卡
    $(document).on('click', '.delete', function () {
        var _this = $(this), btnText = $(this).text();
        var account_id = $(this).parents('.bankItem').find('.account_id').text();
        if(DisableClick(_this)) return;
        DeleteBank(token, account_id, function (response) {
            if(response.errcode == '0'){
                LayerFun('successfulProcessing');
                _this.closest('.bankItem').remove();
            }
        }, function (response) {
            GetErrorCode(response.errcode);
            return;
        });
    })
});