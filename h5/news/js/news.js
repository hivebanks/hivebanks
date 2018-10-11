$(function () {
    function GetIndexCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        } else {
            return null;
        }
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
            console.log(response.rows);
            var data = response.rows;
            // <li>
            //     <a href="#">项目的介绍以及后续项目的跟进</a>
            //         <p class="news_time font-size-14"><span>2018/10/11</span><span>风赢</span></p>
            //     </li>
            var li = "";
            $.each(data, function (i, val) {
                li+="<li>" +
                    "<a href='newsInfo.html?news_id='"+ data[0].title +"></a>" +
                    "<span class='news_id none'>"+ data[0].news_id +"</span>" +
                    "<p class='news_time font-size-14'><span>"+ data[0].ctime +"</span><span>"+ data[0].author +"</span></p>" +
                    "</li>"
            });
            $(".news_list_item").html(li);

        }
    }, function (response) {
        // LayerFun(response.errcode);
    })

    // var smokyBG = $('#smoky-bg').waterpipe({
    //     gradientStart: '#51ff00',
    //     gradientEnd: '#001eff',
    //     smokeOpacity: 0.1,
    //     smokeSize: 100,
    //     numCircles: 1,
    //     maxMaxRad: 'auto',
    //     minMaxRad: 'auto',
    //     minRadFactor: 0,
    //     iterations: 8,
    //     drawsPerFrame: 10,
    //     lineWidth: 2,
    //     speed: 10,
    //     bgColorInner: "#111",
    //     bgColorOuter: "#000"
    // });
});
