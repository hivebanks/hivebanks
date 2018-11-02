<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/7/31
 * Time: 下午6:32
 */

require_once 'db/la_func_config.php';
//install_check_steps();

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
                    <h1 class="i18n" name="fillData"></h1>
                </div>
                <div class="col-md-12 col-sm-12">
                    <div class="formBox">
                        <form>
                            <p class="i18n" name="fillConnectionInfo"></p>
                            
                            <input value="3" name="step" type="hidden">
                            <table class="form-table">
                                <tr>
                                    <th scope="row"><label for="dbname" class="i18n" name="databaseName"></label></th>
                                    <td class="input-field">
                                        <input id="dbname" name="dbname" type="text" size="25" class="validate">
                                    </td>
                                    <td class="padding-left-5 i18n" name="whichDatabase"></td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="uname" class="i18n" name="username"></label></th>
                                    <td>
                                        <input id="uname" name="uname" type="text" size="25" class="validate">
                                    </td>
                                    <td class="padding-left-5 i18n" name="youDatabase"></td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="pwd" class="i18n" name="password"></label></th>
                                    <td>
                                        <input id="pwd" name="pwd" type="password" size="25" class="validate" autocomplete="off">
                                    </td>
                                    <td class="padding-left-5 i18n" name="youDatabasePassword"></td>
                                </tr>
                                <tr>
                                    <th scope="row"><label for="dbhost" class="i18n" name="databaseHost"></label></th>
                                    <td>
                                        <input id="dbhost" name="dbhost" type="text" size="25" class="validate" >
                                    </td>
                                    <td class="padding-left-5"><span class="i18n" name="if"></span> <code>localhost</code> <span class="i18n" name="notUse"></span>，<span class="i18n" name="getRightInfo"></span></td>
                                </tr>
                                
                                <input id="reinstall_flag" style="display:none" name="reinstall_flag" value="';?><?php echo isset($_REQUEST['reinstall_flag'])?$_REQUEST['reinstall_flag']:1; echo '">
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
    <script type="text/javascript">
        window.onload=function() {
            var subBtn = document.getElementById("subBtn");
            subBtn.onclick=function() {
              var dbname = document.getElementById("dbname").value;
              var username = document.getElementById("uname").value;
              var pwd = document.getElementById("pwd").value;
              var dbhost = document.getElementById("dbhost").value;
              var reinstall_flag = document.getElementById("reinstall_flag").value;
              
              if(dbname.length <= 0){
                  alert("请输入数据库名");
                  return;
              }
              if(username.length <= 0){
                  alert("请输入用户名");
                  return;
              }
//              if(pwd.length <= 0){
//                  alert("请输入密码");
//                  return;
//              }
              if(dbhost.length <= 0){
                  alert("请输入数据库主机");
                  return;
              }
              window.location.href = "la_setting.php?step=3&uname="+username+"&pwd="+pwd+"&dbname="+dbname+"&dbhost="+dbhost+"&reinstall_flag="+reinstall_flag;
            }  
        }
        
</script>
</body>
</html>';