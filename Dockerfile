#https://github.com/phusion/passenger-docker
FROM phusion/passenger-ruby26:1.0.13

# Set correct environment variables.
ENV DEBIAN_FRONTEND noninteractive

#From the docs: The image has an app user with UID 9999 and home directory
# /home/app. Your application is supposed to run as this user.
COPY --chown=app:app . /home/app/webapp

# Update permissions for the gbladm user and group
COPY bin/change_id.sh /tmp/change_id.sh
RUN chmod 755 /tmp/change_id.sh && \
  /tmp/change_id.sh -u 55012 -g 199

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  mysql-client \
  bash \
  tzdata \
  shared-mime-info \
  runit-systemd \
  openssl && \
  apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
  gem update --system && \
  gem install bundler && \
  rm -f /etc/nginx/sites-enabled/default && \
  rm -f /etc/service/nginx/down && \
  chmod +x /home/app/webapp/bin/*.sh && \
  chown app /etc/ssl/certs && \
  chown app /etc/ssl/openssl.cnf && \
  chown -R app:app /etc/container_environment && \
  chmod -R 755 /etc/container_environment && \
  chown app:app /etc/container_environment.sh /etc/container_environment.json && \
  chmod 644 /etc/container_environment.sh /etc/container_environment.json && \
  chown -R app:app /var/log/nginx && \
  chown -R app:app /var/lib/nginx && \
  chown -R app:app /run

USER app

RUN printf "[SAN]\nsubjectAltName=DNS:*.hul.harvard.edu,DNS:*.lts.harvard.edu" >> /etc/ssl/openssl.cnf && \
  openssl req -new -newkey rsa:4096 -days 3650 -nodes -x509 -subj "/C=US/ST=Massachusetts/L=Cambridge/O=Library Technology Services/CN=*.lib.harvard.edu" -extensions SAN -reqexts SAN -config /etc/ssl/openssl.cnf -keyout /etc/ssl/certs/server.key -out /etc/ssl/certs/server.crt

# Set working directory
WORKDIR /home/app/webapp

RUN bundle install && \
    mkdir -p /home/app/webapp/tmp/cache/downloads && \
    chmod g+s /home/app/webapp/tmp/cache && \
    chmod 755 /home/app/webapp/tmp/cache/downloads

ENTRYPOINT ["bin/migrations.sh"]

# Expose ports
EXPOSE 31000:3001

CMD ["nginx"]