#!/bin/bash

apt-get -y update
#安装nginx
apt-get -y install nginx

#安装php
apt-get -y update
apt-get -y install software-properties-common
add-apt-repository --yes ppa:ondrej/php
apt-get -y update
apt-get -y install php5.6 php5.6-mcrypt php5.6-mbstring php5.6-curl php5.6-cli php5.6-mysql php5.6-gd php5.6-xml php5.6-fpm

#安装mysql
DEBIAN_FRONTEND=noninteractive apt install -y mysql-server

#安装git
apt-get -y install git

#安装jq
apt-get -y install jq

#修改mysqld.cnf
sed -i "s/bind-address/#bind-address/g" /etc/mysql/mysql.conf.d/mysqld.cnf
#重启mysql
service mysql restart

#修改开启session
sed -i "s/session.auto_start = 0/session.auto_start = 1/g" /etc/php/5.6/fpm/php.ini
#重启php-fpm
service php5.6-fpm restart

#创建文件
mkdir /alidata
mkdir /alidata/www
mkdir /alidata/log
mkdir /alidata/log/nginx
mkdir /alidata/log/hivebanks
mkdir /alidata/www/hivebanks
#mkdir /alidata/www/h5_hivebanks
sudo git clone https://github.com/hivebanks/hivebanks.git /alidata/www/hivebanks/
#sudo git clone https://github.com/ly-iOSer/h5_hivebanks.git /alidata/www/h5_hivebanks/


#php创建配置文件
php /create_hivebanks_conf.php
#php /create_h5_hivebanks_conf.php

#域名配置
#api_url=`cat config_url.txt | jq -r '.api_url'`
#sed -i "s/example.com/$api_url/g" /create_hivebanks_conf.php
#h5_url=`cat config_url.txt | jq -r '.h5_url'`
#sed -i "s/example.com/$h5_url/g" /create_h5_hivebanks_conf.php

read -t 300 -p "请输入接口地址(不能带http://):" api_url

while [ "$api_url" == "" ]
do

read -t 300 -p "请输入接口地址(不能带http://):" api_url

done

sed -i "s/example.com/$api_url/g" /etc/nginx/conf.d/hivebanks.conf


#read -t 300 -p "请输入前端地址(不能带http://):" h5_url
#sed -i "s/example.com/$h5_url/g" /etc/nginx/conf.d/h5_hivebanks.conf

#重启nginx
service nginx restart


#执行mysql赋予远程连接
read -t 300 -p "请输入数据库密码(root):" mysqlpassword


while [ "$mysqlpassword" == "" ]
do

read -t 300 -p "请输入数据库密码(root):" mysqlpassword

done


sed -i "s/123456/$mysqlpassword/g" /set_mysql.php
php /set_mysql.php

#给文件权限
chown -R www-data:www-data /alidata
chown -R www-data:www-data /alidata/www/hivebanks
#chown -R www-data:www-data /alidata/www/h5_hivebanks

#删除文件
rm -rf /t.tar
rm -r /loading_system.sh
rm -r /create_hivebanks_conf.php
#rm -r /create_h5_hivebanks_conf.php
rm -r /set_mysql.php

echo "恭喜,已安装成功..."

echo "接口地址:"$api_url
echo "前端地址:"$h5_url
echo "数据库用户名:"root
echo "数据库密码:"$mysqlpassword



