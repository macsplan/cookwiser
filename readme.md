#### copy here

https://gist.github.com/johnantoni/07df65898456ace4307d5bb6cbdc7f51

###############################

This is my take on how to get up and running with NGINX, PHP-FPM, MySQL and phpMyAdmin on OSX Yosemite. 

This article is adapted from the [original by Jonas Friedmann](http://blog.frd.mn/install-nginx-php-fpm-mysql-and-phpmyadmin-on-os-x-mavericks-using-homebrew/). Who I just discovered is from Würzburg in Germany. A stonesthrow from where I was born ;)

## Xcode
Make sure you have the latest version of XCode installed. [Available from the Mac App Store](https://itunes.apple.com/gb/app/xcode/id497799835?mt=12).

Install the Xcode Command Line Tools:

    xcode-select --install
    
## Homebrew 
[Homebrew](http://brew.sh/) is the missing package manager for OSX. 

Download and install using the following command:

  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    
Check for any problems or conflicts:

    brew doctor
    
Update and Upgrade `brew` formulas:

    brew update && brew upgrade
    
## PHP-FPM
We will need to add some extra php formulas to `brew` so that we can install PHP and PHP-FPM:

    brew tap homebrew/dupes
    brew tap josegonzalez/homebrew-php

We can now install php:

    brew install --without-apache --with-fpm --with-mysql php56
    
This will compile PHP on your machine and may take a few minutes.

#### Setup auto start

Make sure you use the version number that got installed previously:

    mkdir -p ~/Library/LaunchAgents
    cp /usr/local/opt/php56/homebrew.mxcl.php56.plist ~/Library/LaunchAgents/

Start PHP-FPM:

    launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.php56.plist

Check that PHP-FPM is listening on port 9000:

    lsof -Pni4 | grep LISTEN | grep php

## MySQL

    brew install mysql
    
#### Setup auto start

    ln -sfv /usr/local/opt/mysql/*.plist ~/Library/LaunchAgents
    
And start the database server:

    launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist
    
#### Secure the installation

    mysql_secure_installation
    
    
#### Test the connection

  mysql -uroot -p
    
## phpMyAdmin 

    brew install phpmyadmin
    
## NGINX

    brew install nginx
   
#### Setup auto start

Since we want to use port 80 have to start the Nginx process as root:

  sudo cp /usr/local/opt/nginx/*.plist /Library/LaunchDaemons/
  sudo chown root:wheel /Library/LaunchDaemons/homebrew.mxcl.nginx.plist
    
#### Test web server

Start Nginx for the first time:

  sudo launchctl load /Library/LaunchDaemons/homebrew.mxcl.nginx.plist
    
The default configuration is set that it will listen on port 8080 instead of the HTTP standard 80. Ignore that for now:

  curl -IL http://localhost:8080
    
The output should look like:

```
HTTP/1.1 200 OK
Server: nginx/1.6.0
Date: Tue, 08 Jul 2014 21:40:38 GMT
Content-Type: text/html
Content-Length: 612
Last-Modified: Tue, 08 Jul 2014 21:35:25 GMT
Connection: keep-alive
ETag: &quot;53bc641d-264&quot;
Accept-Ranges: bytes
```

Stop Nginx again:

  sudo launchctl unload /Library/LaunchDaemons/homebrew.mxcl.nginx.plist

## Configurations

#### nginx.conf

Create some folders which we are going to use in the configuration files:

```
mkdir -p /usr/local/etc/nginx/logs
mkdir -p /usr/local/etc/nginx/sites-available
mkdir -p /usr/local/etc/nginx/sites-enabled
mkdir -p /usr/local/etc/nginx/conf.d
mkdir -p /usr/local/etc/nginx/ssl
sudo mkdir -p /var/www
 
sudo chown :staff /var/www
sudo chmod 775 /var/www
```

Remove the current default nginx.conf (also available as `/usr/local/etc/nginx/nginx.conf.default` in case you want to take a look) and download this custom one via curl from GitHub:


  rm /usr/local/etc/nginx/nginx.conf
    
  curl -L https://gist.github.com/frdmn/7853158/raw/nginx.conf -o /usr/local/etc/nginx/nginx.conf
    
Download the following PHP-FPM configuration from GitHub:

  curl -L https://gist.github.com/frdmn/7853158/raw/php-fpm -o /usr/local/etc/nginx/conf.d/php-fpm

#### Create default virtual hosts

```
curl -L https://gist.github.com/frdmn/7853158/raw/sites-available_default -o /usr/local/etc/nginx/sites-available/default

curl -L https://gist.github.com/frdmn/7853158/raw/sites-available_default-ssl -o /usr/local/etc/nginx/sites-available/default-ssl

curl -L https://gist.github.com/frdmn/7853158/raw/sites-available_phpmyadmin -o /usr/local/etc/nginx/sites-available/phpmyadmin
```

Clone my example virtual host (including 404, 403, and phpinfo() rewrite) using git

```
git clone https://github.com/gil0mendes/nginx-virtual-host.git /var/www

rm -rf /var/www/.git
```

#### Setup SSL

Create folder for our SSL certificates and private keys:

  mkdir -p /usr/local/etc/nginx/ssl

Generate 4096bit RSA keys and the self-sign the certificates in one command:

```
openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -subj '/C=US/ST=State/L=Town/O=Office/CN=localhost' -keyout /usr/local/etc/nginx/ssl/localhost.key -out /usr/local/etc/nginx/ssl/localhost.crt

openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -subj '/C=US/ST=State/L=Town/O=Office/CN=phpmyadmin' -keyout /usr/local/etc/nginx/ssl/phpmyadmin.key -out /usr/local/etc/nginx/ssl/phpmyadmin.crt
```

#### Enable virtual hosts

Now we need to symlink the virtual hosts that we want to enable into the sites-enabled folder:

```
ln -sfv /usr/local/etc/nginx/sites-available/default /usr/local/etc/nginx/sites-enabled/default

ln -sfv /usr/local/etc/nginx/sites-available/default-ssl /usr/local/etc/nginx/sites-enabled/default-ssl

ln -sfv /usr/local/etc/nginx/sites-available/phpmyadmin /usr/local/etc/nginx/sites-enabled/phpmyadmin
```

Start Nginx again:

  sudo launchctl load /Library/LaunchDaemons/homebrew.mxcl.nginx.plist
    
#### Final tests

Thats it, everything should be up and running. Click on the links below to ensure that:

- [http://localhost](http://localhost) → “Nginx works” page
- [http://localhost/info](http://localhost/info) → phpinfo()
- [http://localhost/nope](http://localhost/nope) → ” Not Found” page
- [https://localhost:443](https://localhost:443) → “Nginx works” page (SSL)
- [https://localhost:443/info](https://localhost:443/info) → phpinfo() (SSL)
- [https://localhost:443/nope](https://localhost:443/nope) → “Not Found” page (SSL)
- [https://localhost:306](https://localhost:306) → phpMyAdmin (SSL)

## Control your services like a boss

Because you probably need to restart the one or other service sooner or later, you probably want to set up some alias.
Download aliases:

```
curl -L https://gist.githubusercontent.com/mgmilcher/c3a1d0138dde3eb0f429/raw/ed04e90d7770dbb62c60e1e4a912f75adc46cb5e/osx-server-aliases -o /tmp/.aliases
```

For bash:

  cat /tmp/.aliases >> ~/.profile
    
For zsh:

  cat /tmp/.aliases >> ~/.zshrc 
    
Close and open the terminal or type `source ~/.profile` or `source ~/.zshrc` to reload the profile.
    
The following commands are now available

#### Nginx
```
nginx.start
nginx.stop
nginx.restart
```

#### PHP-FPM
```
php-fpm.start
php-fpm.stop
php-fpm.restart
```

#### MySQL
```
mysql.start
mysql.stop
mysql.restart
```

#### Nginx Logs
```
nginx.logs.error
nginx.logs.access
nginx.logs.default.access
nginx.logs.default-ssl.access
nginx.logs.phpmyadmin.access
```