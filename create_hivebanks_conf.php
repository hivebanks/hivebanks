<?php
$file  = '/etc/nginx/conf.d/hivebanks.conf';
$content = "server\n";
$content.= "{\n";
$content.= "listen 80;\n";
$content.= "server_name example.com;\n";
$content.= "index index.html index.htm index.php;\n";
$content.= "root  /alidata/www/hivebanks/;\n";
$content.= "error_page   404   /404/404.html;\n";
$content.= "location / {\n";
$content.= "index index.html index.htm index.php;\n";
$content.= "if (!-e $"."request_filename) {\n";
$content.= "rewrite ^/(\d+) /index.php/Show/index/roomnum/$1/  last;\n";
$content.= "rewrite ^/OpenAPI/(.*)$ /OpenAPI/index.php?s=$1 last;\n";
$content.= "rewrite  ^/(.*)$  /index.php/$1/index  last;\n";
$content.= "rewrite ^/(.*)$ /index.php?s=$1 last;\n";
$content.= "rewrite  ^/(.*)$  /index.php/$1/index  last;\n";
$content.= "  break;\n";
$content.= " }\n";
$content.= "} \n";
$content.= "location ~ [^/]\.php(/|$)\n";
$content.= " {\n";
$content.= "try_files $"."uri =404;\n";
$content.= " fastcgi_pass   unix:/run/php/php5.6-fpm.sock;\n";
$content.= "fastcgi_index index.php;\n";
$content.= " include fastcgi.conf;\n";
$content.= "set $"."fastcgi_script_name2 $"."fastcgi_script_name;\n";
$content.= "if ($"."fastcgi_script_name ~ \"^(.+\.php)(/.+)$\") {\n";
$content.= "set $"."fastcgi_script_name2 $1;\n";
$content.= "set $"."path_info $2;\n";
$content.= "}\n";
$content.= "fastcgi_param   PATH_INFO $"."path_info;\n";
$content.= "fastcgi_param   SCRIPT_FILENAME   $"."document_root$"."fastcgi_script_name2;\n";
$content.= "fastcgi_param   SCRIPT_NAME   $"."fastcgi_script_name2;\n";
$content.= "    }\n";
$content.= "error_log   /alidata/log/nginx/hivebanks.log;\n";
$content.= "location ~ \/style\/.*\.php {\n";
$content.= "deny all;\n";
$content.= "return 404;\n";
$content.= "}\n";
$content.= " location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$\n";
$content.= "{\n";
$content.= "expires      30d;\n";
$content.= "}\n";
$content.= " location ~ .*\.(js|css)?$\n";
$content.= "{\n";
$content.= "expires      12h;\n";
$content.= "   }\n";
$content.= " location ~ ^(.*)\/\.svn\/ {\n";
$content.= "	return 404;\n";
$content.= "}\n";
$content.= "    }\n";


$fp = fopen($file, "w+"); //写方式打开文件
fwrite($fp, $content); //存入内容
fclose($fp); //关闭文件
?>