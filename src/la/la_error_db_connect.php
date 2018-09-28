<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/7/31
 * Time: 下午4:30
 */

echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta id="i18n_pagename" content="index-common">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <title class="i18n" name="errorTitleConnect"></title>
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
                <h1 class="i18n" name="connectFail"></h1>
            </div>
            <div class="col-md-12 col-sm-12">
                <div class="textBox">
                    <p class="i18n" name="connectFailOne"></p>
                    <ul>
                        <li class="i18n" name="connectFailTwo"></li>
                        <li class="i18n" name="connectFailThree"></li>
                        <li class="i18n" name="connectFailFour"></li>
                    </ul>
                    <p class="i18n" name="connectFailFive"></p>
                    <p class="margin-top-5">
                        <!--<a href="two.html" class="">现在就开始！</a>-->

                        <a href="la_setting.php?step=2" class="waves-effect waves-light btn startBtn">
                            <span class="i18n" name="retry"></span> ♻
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>
</body>
</html>';