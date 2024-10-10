# Whos1337 

## Local setup

### DB setup

You need to setup the environment variables for the application to access the db. Create a file called `.env.development.local` and add the following variables:

``` txt
POSTGRES_URL="postgres://postgres:mysecretpassword@localhost:54320/mydb"
```

### Authentication setup

You need to setup the environment variables for the Auth0 authentication. Create a file called `.env.development.local` and add the following variables:

``` txt
AUTH0_SECRET="some-secret"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://your-domain.eu.auth0.com"
AUTH0_CLIENT_ID="some-client-id"
AUTH0_CLIENT_SECRET="some-client-secret"
```

### Running the application

First start by running the local `PostgreSQL` and `pgAdmin4` by running:

``` shell
$ docker-compose up -d
```

This will host `pgAdmin4` on [localhost:8080](http://localhost:8080) and `PostgreSQL` on [localhost:54320](http://localhost:54320).

Start by installing all dependencies:

```shell
$ npm install
```

Now run the database startup script:

``` bash
$ node config/db-setup.js
```

This will ensure that all tables are setup correctly.

and the running the application

```shell
$ npm run dev
```

The application will be hosted on [localhost:3000](http://localhost:3000).

### Database UI

If you want to open `pgAdmin4` first go to [localhost:8080](http://localhost:8080). Then login with the following credentials:

- username: `admin@example.com`
- password: `admin`

To connect click the `Add New Server` and fill out the form:

- Name: `Docker PostgreSQL`
- Host name/address: `postgres`
- Port: `5432`
- Username: `postgres`
- Password: `mysecretpassword`

and click Save.
