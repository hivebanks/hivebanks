$(function () {
    function GetIndexCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }

    if (user_token) {
        $('.usLogin').remove();
        $('.accountNone').removeClass('accountNone');
    }

    var user_token = GetIndexCookie('user_token');
    var ba_token = GetIndexCookie('ba_token');
    var ca_token = GetIndexCookie('ca_token');

    $('.baLogin').click(function () {
        if (ba_token) {
            window.location.href = 'ba/BaAccount.html';
        } else {
            window.location.href = 'ba/BaLogin.html';
        }
    });
    $('.caLogin').click(function () {
        if (ca_token) {
            window.location.href = 'ca/CaAccount.html';
        } else {
            window.location.href = 'ca/CaLogin.html';
        }
    });
    $('.usLogin').click(function () {
        if (user_token) {
            window.location.href = 'user/account.html';
        } else {
            window.location.href = 'user/login.html';
        }
    });

    //get news list
    Get_News_List(function (response) {
        if (response.errcode == "0") {
            var data = response.rows;
            var li = "";
            $.each(data, function (i, val) {
                li += "<li>" +
                    "<a href='newsInfo.html?news_id=" + data[i].news_id + "'>" + data[i].title + "</a>" +
                    "<p class='news_time font-size-14'><span>" + data[i].utime + "</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span>" + data[i].author + "</span></p>" +
                    "</li>"
            });
            $(".news_list_item").html(li);

        }
    }, function (response) {
        return;
    })
});
