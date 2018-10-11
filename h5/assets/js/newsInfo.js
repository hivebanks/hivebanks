$(function () {
    $(document).on("click", ".leftNewsTitle", function () {
        $(this).addClass("activeNews").siblings(".leftNewsTitle").removeClass("activeNews");
    });

    //get news_id
    var news_id = GetQueryString("news_id");

    //get news info
    function GetNewsInfoFun(news_id) {
        GetNewsInfo(news_id, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                $(".title").text(data[0].title);
                $(".ctime").text(data[0].utime);
                $(".author").text(data[0].author);
                $(".news_content").html(data[0].content);
            }
        }, function (response) {
            return;
        });
    }

    GetNewsInfoFun(news_id);

    $(document).on("click", ".leftNewsTitle", function () {
        var news_id = $(this).attr("name");
        GetNewsInfoFun(news_id);
    });

    //get news list
    Get_News_List(function (response) {
        if (response.errcode == "0") {
            var data = response.rows;
            var li = "", li_first = "", li_other = "";
            $.each(data, function (i, val) {
                li += "<li class='leftNewsTitle' title='" + data[i].title + "' name='" + data[i].news_id + "'>" + data[i].title + "</li>"
            });
            $(".newsInfo_nav").html(li);

        }
    }, function (response) {
        return;
    })
});