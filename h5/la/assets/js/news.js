$(function () {
    //get token
    var token = GetCookie("la_token");

    //get news list
    $(".preloader-wrapper").addClass("active");
    GetNewsList(token, function (response) {
        if (response.errcode == "0") {
            $(".preloader-wrapper").removeClass("active");
            var data = response.rows, tr = "";
            if (data == null) {
                GetDataEmpty("newsList", "4");
                return;
            }
            $.each(data, function (i, val) {
                tr += "<tr>" +
                    "<td><span>" + data[i].title + "</span></td>" +
                    "<td><span>" + data[i].content + "</span></td>" +
                    "<td><span>" + data[i].author + "</span></td>" +
                    "<td><span>" + data[i].ctime + "</span></td>" +
                    "<td>" +
                    "<button class='btn btn-success modifyNewsBtn i18n' name='modify'>modify</button>" +
                    "<button class='btn btn-danger deleteNewsBtn i18n' name='delete'>delete</button>" +
                    "</td>" +
                    "</tr>"
            });
            $("#newsList").html(tr);
            execI18n();
        }

    }, function (response) {
        $(".preloader-wrapper").removeClass("active");
        GetDataFail("newsList", "4");
        LayerFun(response.errcode);
    })

});