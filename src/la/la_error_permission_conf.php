<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/9/4
 * Time: 下午3:06
 */


echo '<html xmlns="http://www.w3.org/1999/xhtml">
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
                <p class="i18n" name="sorryForPermissionConfI"></p>
                    <p class="i18n" name="sorryForPermissionConfII"></p>
                <textarea style="height:300px" cols="98" rows="15" class="code" readonly="readonly">

{ 
      "api_url" :  "';echo $_REQUEST['au'];echo '",
      "benchmark_type" : "';echo $_REQUEST['bt'];echo '",
      "ca_currency" : "';  echo $_REQUEST['cc'];echo '",
      "userLanguage" :  "'; echo $_REQUEST['ul'];echo '",
      "h5_url" :  "';echo $_REQUEST['hu'];echo '"
}
                    ';echo '</textarea><br/><br/>
                <p class="i18n" name="installTips"></p>
                <p class="step">
                    <a href="';url();echo '" class="button button-large">
                        <span class="i18n" name="installNow"></span> ➡
                    </a>
                </p>
            </div>
       </section>
       
        </body>
        </html>';

        function url(){
            $user = $_REQUEST['u'];
            $au = $_REQUEST['au'];
            $bt = $_REQUEST['bt'];
            $cc = $_REQUEST['cc'];
            $ul = $_REQUEST['ul'];
            $hu = $_REQUEST['hu'];
            echo "la_setting.php?step=7&u=$user&au=$au&bt=$bt&cc=$cc&ul=$ul&hu=$hu&reinstall_flag=1";
        }