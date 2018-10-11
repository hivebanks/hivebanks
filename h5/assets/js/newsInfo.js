$(function () {
    $(document).on("click", ".leftNewsTitle", function () {
        $(this).addClass("activeNews").siblings(".leftNewsTitle").removeClass("activeNews");
    });

    //get news_id
    var news_id = GetQueryString("news_id");

    //get news info
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

    //get news list
    Get_News_List(function (response) {
        if (response.errcode == "0") {
            var data = response.rows;
            var li = "";
            $.each(data, function (i, val) {
                li += "<li class='leftNewsTitle' title='"+ data[i].title +"'>"+ data[i].title +"</li>"
            });
            $(".newsInfo_nav").html(li);

        }
    }, function (response) {
        return;
    })
});