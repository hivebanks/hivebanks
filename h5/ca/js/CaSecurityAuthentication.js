$(function(){
    GetCaAccount();
    var urlTitle=window.location.search.split("=")[1].toLowerCase().trim();
    var urlTitleToUpCase=urlTitle.toUpperCase();
    $(".authenticationTitle").text(urlTitleToUpCase);
    if($(".row").hasClass(urlTitle)){
        $(".row."+urlTitle).css({"display":"block"});
    }
});