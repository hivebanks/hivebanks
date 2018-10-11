$(function () {
    $(document).on("click", ".leftNewsTitle", function () {
        $(this).addClass("activeNews").siblings(".leftNewsTitle").removeClass("activeNews");
    });

    //get news_id
    var news_id = GetQueryString("news_id");

    //get news list
    GetNewsInfo(news_id, function (response) {
        if (response.errcode == "0") {
            console.log(response)
        }
    }, function (response) {
        return;
    })
});