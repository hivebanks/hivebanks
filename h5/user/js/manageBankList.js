$(function () {
    // token
    var token = GetCookie('user_token');
    GetUsAccount();

    //Get the list of added bank cards
    GetAddBankList(token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, tr = '';
            if (data == false) {
                GetDataEmpty('manageBankTable', '4');
                return;
            }
            $.each(data, function (i, val) {
                tr += '<tr class="bankItem">' +
                    '<td><span><i class="iconfont icon-' + data[i].cash_channel.toLowerCase() + '"></i></span><span>' + data[i].lgl_address.lgl_address + '</span></td>' +
                    '<td>' + data[i].lgl_address.name + '</td>' +
                    '<td>' + data[i].lgl_address.idNum + '</td>' +
                    '<td>' + data[i].ctime + '</td>' +
                    '<td>' +
                    '<a href="javascript:;" class="delete btn btn-success btn-sm i18n" name="delete">delete</a>' +
                    '<span class="none account_id">' + data[i].account_id + '</span>' +
                    '</td>' +
                    '</tr>'
            });
            $('#manageBankTable').html(tr);
            execI18n();
        }
    }, function (response) {
        if (response.errcode == '114') {
            window.location.href = 'login.html';
            return;
        }
        GetDataFail('manageBankTable', '4');
        LayerFun(response.errcode);
        return;
    });

    //Delete the bound bank card
    $(document).on('click', '.delete', function () {
        var _this = $(this), btnText = $(this).text();
        var account_id = $(this).parents('.bankItem').find('.account_id').text();
        if (DisableClick(_this)) return;
        ShowLoading("show");
        DeleteBank(token, account_id, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                LayerFun('successfulProcessing');
                _this.closest('.bankItem').remove();
            }
        }, function (response) {
            ShowLoading("hide");
            LayerFun(response.errcode);
            return;
        });
    })
});