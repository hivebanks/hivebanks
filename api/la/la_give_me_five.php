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
                <h1 class="i18n" name="success"></h1>
                <p class="i18n" name="installComplete">HiveBanks 安装完成。谢谢！</p>
            </div>
            <div class="col-md-4 col-md-offset-4 col-sm-12">
                <div class="textBox">
                    <ul class="loginInfo margin-top-10">
                        <li class="i18n" name="username"></li>
                       <li><?php echo $_REQUEST['u'];?></li>
                    </ul>
                    <ul class="loginInfo">
                        <li class="i18n" name="password"></li>
                        <li> ******* </li>
                    </ul>
                    <p class="margin-top-10">
                        <button class="waves-effect waves-light btn startBtn width-100" id = "startBtn">
                            <span class="i18n" name="login"></span> ➡
                        </button>
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>
<script>

    window.onload=function() {
      var startBtn = document.getElementById("startBtn");
      startBtn.onclick=function() {
          <?php
              require_once "../inc/common.php";
              $url_href = Config::LA_LOGIN_URL;
          echo "location.href='$url_href'";
          ?>


      }
    }
</script>

</body>
</html>;

