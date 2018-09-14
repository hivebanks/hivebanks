Amazon server configuration tutorial
1：Connect to the server remotely using the tools or the server's official website and switch to root
2：Download the script to unzip and run the following command
Get the server Generated. Pem file (AWS->EC2-> key pair -> create key pair to create new key pair
The new key pair only needs to enter a name and the server will automatically generate the.pem file ）， Then download to the local computer and run the file path of the command ssh-i. pem (for example, my file directory: C:\Users, syc\. SSH \ Banks. Pem) server username @server IP directly login 
sudo su (Get root authority)
wget -O /hivebanks.tar http://doc.fnying.com/environment/hivebanks.tar && tar xvf /hivebanks.tar -C /（Download and unzip the script）
. /loading_system.sh（Run the script）
3：The configuration script information is as follows
#!/bin/bash

apt-get -y update
# installation nginx
apt-get -y install nginx

# installation php
apt-get -y update
apt-get -y install software-properties-common
add-apt-repository --yes ppa:ondrej/php
apt-get -y update
apt-get -y install php5.6 php5.6-mcrypt php5.6-mbstring php5.6-curl php5.6-cli php5.6-mysql php5.6-gd php5.6-xml php5.6-fpm

# installation  mysql
DEBIAN_FRONTEND=noninteractive apt install -y mysql-server

# installation git
apt-get -y install git

# installation jq
apt-get -y install jq

#change mysqld.cnf
sed -i "s/bind-address/#bind-address/g" /etc/mysql/mysql.conf.d/mysqld.cnf
#restart mysql
service mysql restart

# change on session
sed -i "s/session.auto_start = 0/session.auto_start = 1/g" /etc/php/5.6/fpm/php.ini
#restartphp-fpm
service php5.6-fpm restart

# Create a file
mkdir /alidata
mkdir /alidata/www
mkdir /alidata/log
mkdir /alidata/log/nginx
mkdir /alidata/log/hivebanks
mkdir /alidata/www/hivebanks
mkdir /alidata/www/h5_hivebanks
sudo git clone https://github.com/ly-iOSer/hivebanks.git /alidata/www/hivebanks/
sudo git clone https://github.com/ly-iOSer/h5_hivebanks.git /alidata/www/h5_hivebanks/

#phpCreate profile
php /create_hivebanks_conf.php
php /create_h5_hivebanks_conf.php

# The domain name configuration
#api_url=`cat config_url.txt | jq -r '.api_url'`
#sed -i "s/example.com/$api_url/g" /create_hivebanks_conf.php
#h5_url=`cat config_url.txt | jq -r '.h5_url'`
#sed -i "s/example.com/$h5_url/g" /create_h5_hivebanks_conf.php

read -t 300 -p " Please enter the interface address (no http://):" api_url
sed -i "s/example.com/$api_url/g" /etc/nginx/conf.d/hivebanks.conf

read -t 300 -p " Please enter the front-end address (no http://):" h5_url
sed -i "s/example.com/$h5_url/g" /etc/nginx/conf.d/h5_hivebanks.conf


# Restart the nginx
service nginx restart

# Execute mysql to grant remote connections
read -t 300 -p " Please enter the database password (root):" mysqlpassword
sed -i "s/123456/$mysqlpassword/g" /set_mysql.php
php /set_mysql.php

# Give file permissions
chown -R www-data:www-data /alidata
chown -R www-data:www-data /alidata/www/hivebanks
chown -R www-data:www-data /alidata/www/h5_hivebanks

# Delete the file
rm -rf /t.tar
rm -r /loading_system.sh
rm -r /create_hivebanks_conf.php
rm -r /create_h5_hivebanks_conf.php
rm -r /set_mysql.php

echo " Congratulations, installed successfully..."

echo " Address of the interface:"$api_url
echo " The front-end address:"$h5_url
echo " Database user name:"root
echo " Database password:"$mysqlpassword

You can also download the server configuration script
The configuration process will show the following fragment, and fill in the interface address and database password according to the prompt. Configuration is done.
Note: the database password and interface address must be filled in, otherwise the LA creation may fail. The steps to resolve the domain name to the current server are not covered. The domain name written here is truly accessible.
The introduction to AWS server configuration ends here. Thank you for your use!
