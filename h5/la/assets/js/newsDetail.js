$(function () {
    //get token
    var token =GetCookie("la_token");

   var news_id = GetQueryString("news_id");
   console.log(news_id);

   //get news detail
    GetNewsDetail(token, news_id, function (response) {
        if(response.errcode == "0"){
            console.log(response);
            var data = response.rows;
            $(".newsTitle").text(data[0].title);
            $(".newsContent").text(data[0].content);
        }
    }, function (response) {
        LayerFun("acquisitionFailed");
    })
});