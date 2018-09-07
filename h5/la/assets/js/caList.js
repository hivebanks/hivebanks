$(function () {
    //Get token
    var token = GetCookie('la_token');

    //Get the list of users
    var api_url = 'ca_list.php', limit = 10, offset = 0, n = 0;
    GetUserList(token, api_url, limit, offset, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, tr = '';
            $.each(data, function (i, val) {
                tr += '<tr>' +
                    '<td><a href="javascript:;" class="ca_id">' + data[i].ca_id + '</a></td>' +
                    '<td>' + data[i].ca_level + '</td>' +
                    '<td>' + data[i].security_level + '</td>' +
                    '<td>' + data[i].ctime + '</td>' +
                    '</tr>'
            });
            $('#caList').html(tr);
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //Jump user details
    $(document).on('click', '.ca_id', function () {
        var ca_id = $(this).text();
        window.location.href = 'caInfo.html?ca_id=' + ca_id;
    })
});