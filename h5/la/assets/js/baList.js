$(function () {
    //获取token
    var token = GetCookie('la_token');

    //获取ba列表
    var api_url = 'ba_list.php', limit = 10, offset = 0, n = 0;
    GetUserList(token, api_url, limit, offset, function (response) {
        if(response.errcode == '0'){
            var data = response.rows, tr = '';
            if(data == false){
                GetDataEmpty('baList', '4');
                return;
            }
            $.each(data, function (i, val) {
                tr+='<tr class="baListItem">' +
                    '<td><a href="javascript:;" class="ba_id">'+ data[i].ba_id +'</a></td>' +
                    '<td><a href="javascript:;" class="ba_type">'+ data[i].ba_type +'</a></td>' +
                    '<td>'+ data[i].ba_level +'</td>' +
                    '<td>'+ data[i].security_level +'</td>' +
                    '<td>'+ data[i].ctime +'</td>' +
                    '</tr>'
            });

            $('#baList').html(tr);
        }
    }, function (response) {
        GetDataFail('baList', '4');
        GetErrorCode(response.errcode);
        return;
    });

    //跳转用户详情信息
    $(document).on('click', '.ba_id', function () {
        var ba_id = $(this).text(), ba_type = $(this).parents('.baListItem').find('.ba_type').text();
        window.location.href = 'baInfo.html?ba_id=' + ba_id + '&ba_type=' + ba_type;
    })
});