#!/bin/bash
#This script forces the db migrate to be run on the local mysql container

/home/app/webapp/bin/wait-for-it.sh geoblacklight_db:3306

set -e

rake db:migrate

exec "$@"