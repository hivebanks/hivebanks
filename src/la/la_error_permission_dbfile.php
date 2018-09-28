<?php

/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/9/4
 * Time: 下午1:51
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
            <p class="i18n" name="sorryForPermissionDbFile"></p>
            
        <textarea  cols="980" rows="150" style="height:300px" readonly="readonly">
<?php

class DB_COM extends Mysql {
            
     public $schema = "';echo $_REQUEST['dn'];echo '";
     protected $server = "';echo $_REQUEST['s'];echo '";
     protected $user = "';  echo $_REQUEST['u'];echo '";
     protected $password = "'; echo $_REQUEST['p'];echo '";
     protected $database = "';echo $_REQUEST['dn'];echo '";
     protected $character = "utf8mb4";
            
}
            
?>'; echo '</textarea>
<br/><br/>
            <p class="i18n" name="installTips"></p>
            
        <p class="step"><a href="';url();echo '" class="button button-large"><span class="i18n" name="installNow"></span> ➡</a></p>

 </div></section>
 
        </body>
        </html>';

        function url(){
            $db = $_REQUEST['dn'];
            $s = $_REQUEST['s'];
            $u = $_REQUEST['u'];
            $p = $_REQUEST['p'];
            echo "la_setting.php?step=4&db=$db&u=$u&s=$s&p=$p&reinstall_flag=1";
        }