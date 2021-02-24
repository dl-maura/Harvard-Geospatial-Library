#!/bin/bash
#This script forces the db migrate to be run on the local mysql container

/home/app/webapp/bin/wait-for-it.sh geoblacklight_db:3306

set -e

chown app:app /etc/nginx/sites-enabled/webapp.conf
rake db:migrate
chown -R app:app /home/app/webapp/log

exec "$@"