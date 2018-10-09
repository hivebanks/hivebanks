var arr = document.cookie.match(new RegExp("(^| )UUID=([^;]*)(;|$)"));
var uuid = (arr != null) ? unescape(arr[2]):'';
var ref = escape(document.referrer);
var url = escape(window.location.href);
var xmlhttp;
if (window.XMLHttpRequest) {
    xmlhttp=new XMLHttpRequest();
} else {
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}
xmlhttp.open("GET","http://www.fnying.com/php/cnt_action.php?referrer=" + ref + "&url=" + url + "&uuid=" + uuid, true);
xmlhttp.send();