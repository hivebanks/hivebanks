$(function () {
    //get token
    var token = GetCookie('ca_token');
    GetCaAccount();

    //Get the added type
    GetAddAgencyType(token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, li = '';
            if (data.length == false) {
                $('.noProxyAdded').show();
            }
            $.each(data, function (i, val) {
                li += '<li class="flex center space-between alreadyItem margin-bottom-2">' +
                    '<div class="width-10"><img src="img/' + data[i].ca_channel + '.png" alt=""></div>' +
                    '<span>' + data[i].lgl_address.card_nm + '</span>' +
                    '<span>' + data[i].lgl_address.name + '</span>' +
                    '<button class="btn btn-success btn-sm deleteBtn i18n" name="delete">删除</button>' +
                    '</li>'
            });
            $('.agencyBox>ul').html(li);
            execI18n();
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //Delete the added type
    $(document).on('click', '.deleteBtn', function () {
        $(this).parents('.alreadyItem').remove();
    })
});