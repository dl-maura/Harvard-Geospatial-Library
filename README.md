# Geoblacklight

## Introduction

A basic sample app with Geoblacklight, mySQL, and Solr in Docker Compose.

## Technology Stack
##### Language
Ruby

##### Framework
Rails

##### Development Operations
Docker Compose

##### Database
mySQL

##### Search
Solr


## Servers
* Project Wiki: https://wiki.harvard.edu/confluence/display/LibraryTechServices/HGL+4.0
* SSL Local site: https://localhost:3001
* SSL Dev sites: 
  - https://hgl-dev.lib.harvard.edu/
  - https://gbl-dev.lib.harvard.edu/  

## Local Development Environment Setup Instructions

### IMPORTANT NOTE FOR WINDOWS 10 USERS!
Docker should be using the WSL 2 based engine, as opposed to the Hyper-V backend. This requires Windows 10, version 1903 or higher. See this for more information on setting up WSL 2 for Windows 10:
https://docs.docker.com/docker-for-windows/wsl/ 

### 1: Clone the repository to a local directory
git clone git@github.com:harvard-huit/Harvard-Geospatial-Library.git

### 2: Windows 10 Users run dos2unix

WINDOWS 10 USERS: run dos2unix on the localdb.sh and migrations.sh files through an [Ubuntu Windows Subsystem For Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
- `sudo apt install dos2unix`
- `dos2unix bin/localdb.sh`
- `dos2unix bin/migrations.sh`

### 3: Create app environment variables

##### Create config file for environment variables
- Make a copy of the config example file `./env-example.txt`
- Rename the file to `.env`
- Replace placeholder values as necessary

*Note: The config file .env is specifically excluded in .gitignore and .dockerignore, since it contains credentials it should NOT ever be committed to any repository.*

### 4: Create database config

##### Create config file for the database connection
- Make a copy of the config example file `./config/database.yml.example`
- Rename the file to `database.yml`
- Replace placeholder values as necessary
- Note that this pulls in the environment variables that are set in the `.env` file

The database gets created automatically by passing in environment variables into the mySQL in the docker compose file. The volume mounts the mySQL data to the local filesystem `./db-data:/var/lib/mysql`. The first time the database is created, the `./db-data` directory will appear on the local filesystem. To start with a fresh database, delete the ./db-data directory on the local filesystem and restart the containers and it will be created again from scratch. Note that this will delete all data in the database. The mySQL container is for development use only, when the application is deployed to the docker server it will be connected to a database server directly.

### 5: Start

This command builds all images and runs all containers specified in the docker-compose-local.yml configuration.

A local version of the docker compose file `docker-compose-local.yml` should be used for local development. The name of the local compose file must be specified in the command with the -f option. This local docker compose file points to a local version of the dockerfile `DockerfileLocal`, which is specified in the services > geoblacklight_web > build > dockerfile property.

This command uses the `docker-compose-local.yml` file to build the `DockerfileLocal` image `--build` and also starts the containers `up` in background mode `-d`.

```
docker-compose -f docker-compose-local.yml up -d --build --force-recreate
```

To restart the containers later without a full rebuild, the options `--build` and `--force-recreate` can be omitted after the images are built already.

### 6: Import Solr data
This repo has a small example set of data you can import with these steps: 
1. Go to http://localhost:8983/solr/#/~cores/
2. Select "blacklight-core" from the core dropdown in the left rail
3. Click on the "Documents" button in the left rail
4. Select "File Upload" from the "Document Type" dropdown
5. Click the "Browse" button and select the `geoblacklight-documents.json` file in the root of the repository.
6. Click the "Submit Document" button

### 7: Run commands inside a container
To run commands inside a running container, execute a shell using the `exec` command. This same technique can be used to run commands in any container that is running already.

```
docker exec -it geoblacklight_web bash
```

Once inside the geoblacklight_web container, Rails commands can be run such as migrations.

```
rake db:migrate
```

Alternatively, to run commands inside a container that is not running already, use the docker run command or the docker compose run command.

### 8: Stop

##### STOP AND REMOVE

This command stops and removes all containers specified in the docker-compose-local.yml configuration. This command can be used in place of the 'stop' and 'rm' commands.

```
docker-compose -f docker-compose-local.yml down
```

## More information
### Volumes
A container does not have persistent storage on its own (without a volume or bind) and the data will not be saved after restarting. A volume mount is the preferred way to persist data generated and used by docker containers.

In this example, the `geoblacklight_web` container mounts in the project into a home directory in the container. The volume syntax is "host_path:container_path" e.g. `.:/home/appuser`. Any files that are generated inside the container by running commands will appear on the local filesystem. Also vise versa, any changes made to files mounted from the local filesystem will appear in the container immediately.

  ```
  geoblacklight_web:
    container_name: geoblacklight_web
    build:
      context: ./
      dockerfile: DockerfileLocal
    env_file: .env
    volumes:
      # host_path:container_path
      - .:/home/appuser
    ports:
      - "3000:3000"
    depends_on:
      - geoblacklight_db
  ```

Read [Docker storage volumes](https://docs.docker.com/storage/volumes/) for more information.
