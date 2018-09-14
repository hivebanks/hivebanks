<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/7/30
 * Time: 上午11:49
 */

echo "<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"utf-8\"/>
    <meta name=\"viewport\"
          content=\"width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no\">
    <title>HB-LA-数据库链接失败</title>
    <link rel=\"stylesheet\" href=\"la-admin/includes/css/common.css\">
    <link rel=\"stylesheet\" href=\"la-admin/includes/css/bootstrap.css\">
    <link rel=\"stylesheet\" href=\"la-admin/includes/css/materialize.min.css\">
</head>
<body>
<section>
    <div class=\"container\">
        <div class=\"row margin-top-5\">
            <div class=\"col-md-12 col-sm-12\">
                <div class=\"align-center\">
                    <img src=\"la-admin/includes/img/logo-3.png\" alt=\"\">
                </div>
            </div>
        </div>
        <div class=\"row\">
            <div class=\"col-md-12 col-sm-12\">
                <h1>建立数据库表时出错</h1>
            </div>
            <div class=\"col-md-12 col-sm-12\">
                <div class=\"textBox\">
                    <p>这意味着您在填写的用户名和密码信息不正确，或我们未能在<code>localhost</code>联系到数据库服务器。这可能意味着您主机的数据库服务器未在运行。</p>
                    <ul>
                        <li>您确定数据库已经建立了吗？</li>
                        <li>您确定表已经建立了吗？</li>
                        <li>您确定数据库服务器在运行吗？</li>
                    </ul>
                    <p>如果您不明白这些意味着什么，您应该联系您的主机提供商。如果您仍需要帮助，请问联系HiveBanks。</p>
                    <p class=\"margin-top-5\">
                        <!--<a href=\"two.html\" class=\"\">现在就开始！</a>-->

                        <a href=\"la_setting.php?step=1\" class=\"waves-effect waves-light btn startBtn\">
                            重试 ♻
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>
</body>
</html>";