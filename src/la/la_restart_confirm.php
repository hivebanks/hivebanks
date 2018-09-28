<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/8/27
 * Time: 下午4:03
 */

require_once 'db/la_func_config.php';
if(!install_check())
    header('location:index.php');

echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta id="i18n_pagename" content="index-common">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <title class="i18n" name="title">HB-LA-重启LA确认</title>
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
                    <h1 class="i18n" name="fillData"></h1>
                </div>
                <div class="col-md-12 col-sm-12">
                    <div class="formBox">
                        <form>
                            <p class="i18n" name="reinstallInfo"></p>
                            
                            <input value="3" name="step" type="hidden">
                            <table class="form-table">
                                <tr>
                                    <th scope="row"><label for="email" class="i18n" name="email"></label></th>
                                    <td class="input-field">
                                        <input id="email" name="email" type="text" size="25" class="validate">
                                    </td>
                                    <td class="padding-left-5 i18n" name="whichEmail"></td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="pwd" class="i18n" name="pwd"></label></th>
                                    <td>
                                        <input id="pwd" name="pwd" type="password" size="25" class="validate">
                                    </td>
                                    <td class="padding-left-5 i18n" name="yourPwd"></td>
                                </tr>

                            </table>
                            <p class="">
                                <a href="javascript:;" id="subBtn" class="waves-effect waves-light btn startBtn">
                                    <span class="i18n" name="installNow"></span> ➡
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
              var email = document.getElementById("email").value;
              var pwd = hex_sha1(document.getElementById("pwd").value);
              
              if(email.length <= 0){
                  alert("请输入数据库名");
                  return;
              }
              if(pwd.length <= 0){
                  alert("请输入密码");
                  return;
              }
              
              window.location.href = "la_setting.php?step=reinstall_flag&pwd="+pwd+"&email="+email;
            }  
        }
        
</script>
</body>
</html>';