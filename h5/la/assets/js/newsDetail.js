$(function () {
    //get token
    var token = GetCookie("la_token");

    var news_id = GetQueryString("news_id");

    //get news detail
    GetNewsDetail(token, news_id, function (response) {
        if (response.errcode == "0") {
            var data = response.rows;
            $(".newsTitle").text(data[0].title);
            $(".time").text(data[0].utime);
            $(".author").text(data[0].author);
            $(".newsContent").html(data[0].content);
        }
    }, function (response) {
        LayerFun("acquisitionFailed");
    })
});