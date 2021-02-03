#https://github.com/phusion/passenger-docker
FROM phusion/passenger-ruby26

# Set correct environment variables.
ENV DEBIAN_FRONTEND noninteractive

#From the docs: The image has an app user with UID 9999 and home directory
# /home/app. Your application is supposed to run as this user.
COPY --chown=app:app . /home/app/webapp

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  mysql-client \
  bash \
  tzdata \
  openssl && \
  apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
  gem update --system && \
  gem install bundler && \
  rm /etc/nginx/sites-enabled/default && \
  chmod +x /home/app/webapp/bin/*.sh && \
  chown app /etc/ssl/certs && \
  chown app /etc/ssl/openssl.cnf

COPY webapp.conf /etc/nginx/sites-enabled/webapp.conf

USER app

RUN printf "[SAN]\nsubjectAltName=DNS:*.hul.harvard.edu,DNS:*.lts.harvard.edu" >> /etc/ssl/openssl.cnf && \
  openssl req -new -newkey rsa:4096 -days 3650 -nodes -x509 -subj "/C=US/ST=Massachusetts/L=Cambridge/O=Library Technology Services/CN=*.lib.harvard.edu" -extensions SAN -reqexts SAN -config /etc/ssl/openssl.cnf -keyout /etc/ssl/certs/server.key -out /etc/ssl/certs/server.crt

# Set working directory
WORKDIR /home/app/webapp

RUN bundle install

ENTRYPOINT ["bin/migrations.sh"]

# Expose ports
EXPOSE 31000:3001 31001:3306 31002:8983

USER root

# Use baseimage-docker's init process.
CMD ["/sbin/my_init"]