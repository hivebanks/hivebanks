<?php
$con = mysql_connect("localhost","root","");
if (!$con)
{
    echo "数据库连接错误";die;
}else{
    $sql = "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%'IDENTIFIED BY '123456' WITH GRANT OPTION;";
    mysql_query($sql);
}
?>