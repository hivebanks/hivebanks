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
                $(".ctime").text(data[0].ctime);
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
                if (data[0]) {
                    li_first = "<li class='leftNewsTitle' title='" + data[0].title + "' name='" + data[0].news_id + "'>" + data[0].title + "</li>";
                    li_other += "<li class='leftNewsTitle' title='" + data[i + 1].title + "' name='" + data[i + 1].news_id + "'>" + data[i + 1].title + "</li>"
                }
                li = li_first + li_other

            });
            $(".newsInfo_nav").html(li);

        }
    }, function (response) {
        return;
    })
});