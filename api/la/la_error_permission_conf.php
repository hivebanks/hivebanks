<?php
/**
 * Created by PhpStorm.
 * User: ahino
 * Date: 2018/9/4
 * Time: 下午3:06
 */


echo '<html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="robots" content="noindex,nofollow" />
            <title>WordPress &rsaquo; 调整配置文件</title>
            <link rel=\'stylesheet\' id=\'buttons-css\'  href=\'http://localhost/wordpress/wp-includes/css/buttons.min.css?ver=4.9.4\' type=\'text/css\' media=\'all\' />
        <link rel=\'stylesheet\' id=\'install-css\'  href=\'http://localhost/wordpress/wp-admin/css/install.min.css?ver=4.9.4\' type=\'text/css\' media=\'all\' />
        </head>
        <body class="wp-core-ui">
        <p id="logo"><a href="https://cn.wordpress.org/" tabindex="-1">WordPress</a></p>
        <p>抱歉，我不能写入<code>config_url.json</code>文件。</p>
        <p>您可以手工创建<code>config_url.json</code>文件，并将以下文字粘贴于其中。</p>
        <textarea id="wp-config" cols="98" rows="15" class="code" readonly="readonly">

{ 
      "api_url" :  "';?><?echo $_REQUEST['au'];echo '",
      "benchmark_type" : "';?><?echo $_REQUEST['bt'];echo '",
      "ca_currency" : "'; ?><? echo $_REQUEST['cc'];echo '",
      "userLanguage" :  "'; ?><? echo $_REQUEST['ul'];echo '",
      "h5_url" :  "';?><?echo $_REQUEST['hu'];echo '"
}
                ';?>
        <?php echo '</textarea>
        <p>在您做完这些之后，点击“继续安装”</p>
        <p class="step"><a href="';url();echo '" class="button button-large">继续安装</a></p>
        <script>
        (function(){
        if ( ! /iPad|iPod|iPhone/.test( navigator.userAgent ) ) {
            var el = document.getElementById(\'wp-config\');
            el.focus();
            el.select();
        }
        })();
        </script>
        <script type=\'text/javascript\' src=\'http://localhost/wordpress/wp-includes/js/jquery/jquery.js?ver=1.12.4\'></script>
        <script type=\'text/javascript\' src=\'http://localhost/wordpress/wp-includes/js/jquery/jquery-migrate.min.js?ver=1.4.1\'></script>
        <script type=\'text/javascript\' src=\'http://localhost/wordpress/wp-admin/js/language-chooser.min.js?ver=4.9.4\'></script>
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