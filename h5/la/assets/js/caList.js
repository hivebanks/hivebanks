$(function () {
    //获取token
    var token = GetCookie('la_token');

    //获取user列表
    var api_url = 'ca_list.php', limit = 10, offset = 0, n = 0;
    GetUserList(token, api_url, limit, offset, function (response) {
        if(response.errcode == '0'){
            var data = response.rows, tr = '';
            $.each(data, function (i, val) {
                tr+='<tr>' +
                    '<td><a href="javascript:;" class="ca_id">'+ data[i].ca_id +'</a></td>' +
                    '<td>'+ data[i].ca_level +'</td>' +
                    '<td>'+ data[i].security_level +'</td>' +
                    '<td>'+ data[i].ctime +'</td>' +
                    '</tr>'
            });
            $('#caList').html(tr);
        }
    }, function (response) {
        GetErrorCode(response.errcode);
        return;
    });

    //跳转用户详情信息
    $(document).on('click', '.ca_id', function () {
        var ca_id = $(this).text();
        window.location.href = 'caInfo.html?ca_id=' + ca_id;
    })
});