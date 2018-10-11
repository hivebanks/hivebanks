$(function () {
    $(document).on("click", ".leftNewsTitle", function () {
        $(this).addClass("activeNews").siblings(".leftNewsTitle").removeClass("activeNews");
    });

    //get news_id
    var news_id = GetQueryString("news_id");

    //get news list
    GetNewsInfo(news_id, function (response) {
        if (response.errcode == "0") {
            console.log(response);
            var data = response.rows;
            $(".title").text(data[0].title);
            $(".ctime").text(data[0].ctime);
            $(".author").text(data[0].author);
            $(".news_content").html(data[0].content);
        }
    }, function (response) {
        return;
    })
});