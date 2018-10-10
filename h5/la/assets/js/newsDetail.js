$(function () {
    //get token
    var token =GetCookie("la_token");

   var news_id = GetQueryString("news_id");
   console.log(news_id);

   //get news detail
    GetNewsDetail(token, news_id, function (response) {
        if(response.errcode == "0"){
            console.log(response);
        }
    }, function (response) {
        LayerFun("acquisitionFailed");
    })
});