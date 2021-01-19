# Quickstart: Compose and Rails https://docs.docker.com/compose/rails/

# Base image
FROM ruby:2.5.8

# Add app user
RUN useradd --create-home appuser
WORKDIR /home/appuser

# Copy code
COPY --chown=appuser . /home/appuser

# Install dependencies
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
  apt-get update -qq && apt-get install -y \
  nodejs \
  build-essential \
  default-mysql-client \
  default-libmysqlclient-dev \
  bash \
  tzdata \
  openssl && \
  apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
  gem update --system && \
  gem install bundler && \
  chown appuser /etc/ssl/certs && \
  chown appuser /etc/ssl/openssl.cnf

RUN printf "[SAN]\nsubjectAltName=DNS:*.hul.harvard.edu,DNS:*.lts.harvard.edu" >> /etc/ssl/openssl.cnf && \
  openssl req -new -newkey rsa:4096 -days 3650 -nodes -x509 -subj "/C=US/ST=Massachusetts/L=Cambridge/O=Library Technology Services/CN=*.lib.harvard.edu" -extensions SAN -reqexts SAN -config /etc/ssl/openssl.cnf -keyout /etc/ssl/certs/server.key -out /etc/ssl/certs/server.crt

COPY Gemfile /home/appuser/Gemfile
COPY Gemfile.lock /home/appuser/Gemfile.lock
RUN bundle install

ENTRYPOINT ["bin/migrations.sh"]

# Expose ports
EXPOSE 31000:3001

USER appuser

# Start the main process
CMD ["rails", "server", "-b", "0.0.0.0"]