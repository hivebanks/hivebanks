<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/7/31
 * Time: 下午6:33
 */


echo '<!DOCTYPE html>
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
                <h1 class="i18n" name="welcome"></h1>
            </div>
            <div class="col-md-12 col-sm-12">
                <div class="textBox">
                    <p class="i18n" name="welcomeTips"></p>
                    <h5 class="needInfo padding-bottom-1 margin-top-3 width-65 i18n" name="needInfo"></h5>
                    <p class="i18n" name="needFillInfo"></p>
                    <form class="width-65">

                        <table class="form-table">
                        
                            <input value="5" name="step" type="hidden">
                            <tr>
                                <th scope="row"><label for="user_login" class="i18n" name="username"></label></th>
                                <td>
                                    <input name="user_name" type="text" id="user_login" size="25" maxlength="25" value=""
                                           class="validate margin-bottom-0">
                                    <p class="tips i18n" name="usernameTips"></p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="pass1" class="i18n" name="password"></label></th>
                                <td>
                                    <input type="password" name="admin_password" maxlength="25" id="pass1"
                                           class="regular-text validate margin-bottom-0" autocomplete="off">
                                    <p class="tips">
                                        <span class="description important hide-if-no-js">
                                        <strong class="i18n" name="important"></strong>: 
                                        <span class="i18n" name="passwordTips"></span>
                                        </span>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="user_email" class="i18n" name="adminEmail"></label></th>
                                <td>
                                    <input type="text" name="user_email" maxlength="25" id="user_email"
                                           class="regular-text validate margin-bottom-0" autocomplete="off">
                                    <p class="tips">
                                        <span class="description important hide-if-no-js">
                                        <strong class="i18n" name="important"></strong>: 
                                        <span class="i18n" name="adminEmailTips"></span>
                                        </span>
                                    </p>
                                </td>
                            </tr>
<input id="reinstall_flag" style="display:none" name="reinstall_flag" value="';?><?php echo isset($_REQUEST['reinstall_flag'])?$_REQUEST['reinstall_flag']:1; echo '">
                           
                        </table>
                        <p class="">
                                <a href="javascript:;" id="subBtn" class="waves-effect waves-light btn startBtn">
                                    <span class="i18n" name="install"></span> HiveBanks ➡
                                </a>
                            </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
<script src = "admin/includes/js/sha.js"></script> 
<script type="text/javascript">
        window.onload=function() {
            var subBtn = document.getElementById("subBtn");
            subBtn.onclick=function() {
              var user_login = document.getElementById("user_login").value;
              var user_email = document.getElementById("user_email").value;
              var pass1 = hex_sha1(document.getElementById("pass1").value);
              var reinstall_flag = document.getElementById("reinstall_flag").value;
              
              if(user_login.length <= 0){
                  alert("请输入用户名");
                  return;
              }
              if(pass1.length <= 0){
                  alert("请输入密码");
                  return;
              }
              var dbname = GetQueryString("dbname");
              var uname = GetQueryString("uname");
              var pwd = GetQueryString("pwd");
              var dbhost = GetQueryString("dbhost");
              window.location.href = "la_setting.php?step=5&user_email="+user_email+"&user_name="+ user_login +"&admin_password="+ pass1 +"&dbname=" + dbname +"&uname="+uname+"&pwd="+pwd+"&dbhost="+dbhost+"&reinstall_flag="+reinstall_flag;
            }; 
            
            
            
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