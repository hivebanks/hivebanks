$(function () {
    //get token
    var token = GetCookie('la_token');

    //get user list
    var api_url = 'user_list.php', limit = 10, offset = 0, n = 0;
    GetUserList(token, api_url, limit, offset, function (response) {
        if(response.errcode == '0'){
            var data = response.rows, tr = '';
            if(data == false){
                GetDataEmpty('userList', '4');
            }
            $.each(data, function (i, val) {
                tr+='<tr>' +
                    '<td><a href="javascript:;" class="us_id">'+ data[i].us_id +'</a></td>' +
                    // '<td>'+ data[i].base_amount +'&nbsp;<span class="base_type">BTC</span></td>' +
                    // '<td>'+ data[i].lock_amount +'&nbsp;<span class="base_type">BTC</span></td>' +
                    '<td>'+ data[i].us_level +'</td>' +
                    '<td>'+ data[i].security_level +'</td>' +
                    // '<td>'+ data[i].utime +'</td>' +
                    '<td>'+ data[i].ctime +'</td>' +
                    // '<td><a href="#!">编辑</a></td>' +
                    '</tr>'
            });
            $('#userList').html(tr);
        }
    }, function (response) {
        GetDataFail('userList', '4');
        LayerFun(response.errcode);
    });

    //Jump user details
    $(document).on('click', '.us_id', function () {
        var us_id = $(this).text();
        window.location.href = 'userInfo.html?us_id=' + us_id;
    })
});