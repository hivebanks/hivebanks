<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/7/31
 * Time: 下午6:32
 */
require_once 'db/la_func_config.php';
//install_check_steps();

//                            <li>➡更改la_db/la_db_connect.php中的数据库配置选项</li>
//                            <li>➡安装完成删除drop_me_after_installing.php</li>
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
            <div class="col col-md-12 col-sm-12">
            
            <div class="flex end">
                        <p class="languageText" id="en">English</p>
                        <p class="languageText margin-left-2" id="zh-CN">简体中文</p>
                        <p class="languageText margin-left-2" id="ja">Japanese</p>
</div>
 
</div>
</div>
            <div class="row">
                <div class="col-md-12 col-sm-12">
                    <h1 class="i18n" name="beforeStart"></h1>
                </div>
                <div class="col-md-12 col-sm-12">
                
                    <div class="textBox">
                        <p><span class="i18n" name="welcomeInstall"></span> Hivebanks Local Alliance (LA). <span class="i18n" name="weNeedDatabase"></span></p>
                        <ul>
                            <li>➡<span class="i18n" name="fillDatabaseName"></span></li>
                            <li>➡<span class="i18n" name="fillDatabaseUsername"></span></li>
                            <li>➡<span class="i18n" name="fillDatabasePassword"></span></li>
                            <li>➡<span class="i18n" name="fillDatabaseHost"></span></li>
                            <li>➡<span class="i18n" name="fillLaBasic"></span></li>
                        </ul>
                        
                        <p class="i18n" name="stepOneInfoTips"></p>
                        <p class="i18n" name="installFail"></p>
                        <p class="margin-top-5">
                            <a href="la_setting.php?step=2&reinstall_flag=';?><?php echo isset($_REQUEST['reinstall_flag'])?$_REQUEST['reinstall_flag']:1;echo '" class="waves-effect waves-light btn startBtn">
                                <span class="i18n" name="startNow"></span> ➡
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <script type="text/javascript">
    $(function() {
      // 取cookies函数
      function GetCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        }
        var userLanguage = GetCookie("userLanguage");  
      $("#"+ userLanguage +"").addClass("languageActive");
    })
</script>
</body>

</html>';