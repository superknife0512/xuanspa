#!/bin/sh

tar -czf xuanspa.tar.gz app.js bin controllers deploy.sh middleware models package.json public routes utils views webpack.config.js .env
scp xuanspa.tar.gz leesin@68.183.227.153:~
rm xuanspa.tar.gz 

ssh leesin@68.183.227.153 << 'ENDSSH' 
pm2 stop all
mv xuanspa.tar.gz xuanspa 
cd xuanspa
tar -xf xuanspa.tar.gz 
yarn install
pm2 start bin/www

ENDSSH