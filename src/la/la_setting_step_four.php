<?php

echo '
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta id="i18n_pagename" content="index-common">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <title class="i18n" name="title">HB-LA-调整配置文件</title>
    <link rel="stylesheet" href="admin/includes/css/common.css">
    <link rel="stylesheet" href="admin/includes/css/bootstrap.css">
    <link rel="stylesheet" href="admin/includes/css/materialize.min.css">
    <script src="admin/includes/js/jquery-3.2.1.min.js"></script>
    <script src="admin/includes/language/jquery.i18n.properties.js"></script>
    <script src="admin/includes/language/language.js"></script>
</head>
<body>
<section>
    <div class="container">
        <div class="row margin-top-5">
            <div class="col-md-12 col-sm-12">
                <div class="align-center">
                    <img src="admin/includes/img/logo-3.png" alt="">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 col-sm-12">
                <h1 class="i18n" name="setting"></h1>
            </div>
            <div class="col-md-12 col-sm-12">
                <div class="textBox">
                    <p class="i18n" name="configHiveBanksTips"></p>
                    <h5 class="needInfo padding-bottom-1 margin-top-3 width-65 i18n" name="needInfo"></h5>
                    <p class="i18n" name="warning"></p>
                    <form class="width-65">

                        <table class="form-table">

                            <tr>
                                <th scope="row"><label for="benchmark_type" class="i18n" name="benchmarkType"></label></th>
                                <td>
                                    <input name="benchmark_type" type="text" id="benchmark_type" size="25" maxlength="25" value=""
                                           class="validate margin-bottom-0">
                                    <p class="tips i18n" name="benchmarkTypeTips">基准类型：如 “BTC，BCH……”</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="digital_unit" class="i18n" name="digitalUnit"></label></th>
                                <td>
                                    <input type="text" name="digital_unit" maxlength="25" id="digital_unit"
                                           class="regular-text validate margin-bottom-0" autocomplete="off">
                                    <p class="tips">
                                        <span class="description important hide-if-no-js">
                                        <strong class="i18n" name="import"></strong>:
                                            <span class="i18n" name="digitalUnitTips"></span>
                                        </span>
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row"><label for="ca_currency" class="i18n" name="frenchName"></label></th>
                                <td>
                                    <input type="text" name="ca_currency" maxlength="25" id="ca_currency"
                                           class="regular-text validate margin-bottom-0" autocomplete="off">
                                    <p class="tips">
                                        <span class="description important hide-if-no-js">
                                        <strong class="i18n" name="important"></strong>:
                                            <span class="i18n" name="frenchTips"></span>
                                        </span>
                                    </p>
                                </td>
                            </tr>

                            <input id="reinstall_flag" style="display:none" name="reinstall_flag" value="';?><?php echo isset($_REQUEST['reinstall_flag'])?$_REQUEST['reinstall_flag']:1; echo '">
     
                            <tr>
                                <th scope="row"><label for="api_url">api_url</label></th>
                                <td>
                                    <input name="api_url" type="text" id="api_url" size="25" maxlength="225" value=""
                                           class="validate margin-bottom-0">
                                </td>
                            </tr>

                            <tr>
                                <th scope="row"><label for="h5_url">h5_url</label></th>
                                <td>
                                    <input name="h5_url" type="text" id="h5_url" size="25" maxlength="225" value=""
                                           class="validate margin-bottom-0">
                                </td>
                            </tr>

                        </table>
                        <p class="">
                            <a href="javascript:;" id="subBtn" class="waves-effect waves-light btn startBtn">
                                <span class="i18n" name="next"></span> ➡
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
<script type="text/javascript">
    window.onload=function() {
        var subBtn = document.getElementById("subBtn");
        subBtn.onclick=function() {
            var benchmark_type = document.getElementById("benchmark_type").value;
            var digital_unit = document.getElementById("digital_unit").value;
            var ca_currency = document.getElementById("ca_currency").value;
            var api_url = document.getElementById("api_url").value;

            var h5_url = document.getElementById("h5_url").value;

            if(benchmark_type.length <= 0){
                alert("请输入基准类型");
                return;
            }
            if(digital_unit.length <= 0){
                alert("请输入数字货币单位");
                return;
            }
            if(ca_currency.length <= 0){
                alert("请输入法币名称");
                return;
            }
            if(api_url.length <= 0){
                alert("请输入api_url");
                return;
            }
            if(h5_url.length <= 0){
                alert("请输入h5_url");
                return;
            }
            var dbname = GetQueryString("dbname");
            var uname = GetQueryString("uname");
            var pwd = GetQueryString("pwd");
            var dbhost = GetQueryString("dbhost");
            var u = GetQueryString("u");
            
            var reinstall_flag = document.getElementById("reinstall_flag").value;
            window.location.href = "la_setting.php?step=6&ca_currency="+ca_currency+"&benchmark_type="+ benchmark_type +"&digital_unit="+ digital_unit +"&dbname=" + dbname +"&uname="+uname+"&pwd="+pwd+"&dbhost="+dbhost+"&u=" + u+"&api_url="+api_url+"&h5_url="+h5_url+"&reinstall_flag="+reinstall_flag;
        }



        function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }

    }
</script>
</body>
</html>';