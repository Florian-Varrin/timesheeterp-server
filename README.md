# TimesheetERP
TimesheetERP is an open source ERP created primarily for developers. Besides being made for a need, it is a project made mostly for fun. But feel free to use it.  
The primary goal was to be able to use this ERP via the CLI to not lose productivity by switching tool too often.  

At the moment it includes the possibility to create timers to identify what time is spent on each task and to assign times to different projects. 

## Technology
This repository is the server part of the application and was written with Typescript ❤ using the [NestJS framework](https://nestjs.com) framework and run on [NodeJS](https://nodejs.org/en/). It is a RESTful API, you can find the [OpenAPI](https://swagger.io/) documentation of the API by spinning up the server and going to `/api/v1/documentation/` route
The database is [PostgreSQL](https://www.postgresql.org/).

## Client
For now the only client is a [CLI](https://github.com/Florian-Varrin/timesheeterp-cli) written in NodeJS using the [oclif](https://oclif.io/) framework. A [JS client library](https://github.com/Florian-Varrin/timesheeterp-client-js-sdk) is also available and used in the CLI.  
The idea is to be able to use this client to build a frontend client.

## Usage
This is a hobby projet and not a production ready solution, there are certainly bugs. Do not hesitate to open issues if you encounter some. 

## Installation
```bash
$ yarn install
```

## Running the app
```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```
