# Fleet Management RESTful API with Node.JS


A simple Rest API for fleet's delivery management using Node.js, Express, and Mongoose.

The app contains many built-in features, request validation, unit and integration tests, continuous integration, docker support, etc.



## Quick Start

### Requirements

A machine with Docker installed

To run a project, simply run the following commands:

```bash
yarn install
```
```bash
yarn docker:dev
```

## Manual Installation

If you would still prefer to do the installation manually, follow these steps:

Clone the repo:

```bash
git clone git@github.com:DevelopmentHiring/BurakYildirim.git
```

Install and configure MongoDB:

https://www.mongodb.com/docs/manual/administration/install-on-linux/

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
# open .env and modify the environment variables (if needed)
```

Run app

```bash
yarn dev
```

## Table of Contents

- [Features](#features)
- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Validation](#validation)
- [Logging](#logging)
- [Custom Mongoose Plugins](#custom-mongoose-plugins)
- [Linting](#linting)
- [CI Process and Deployment](#ci-process-and-deployment)

## Features

- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Database mocking**: with [Mockgoose](https://github.com/Mockgoose/Mockgoose)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
- **Testing**: unit and integration tests using [Mocha](https://mochajs.org/), [Assert](https://github.com/browserify/commonjs-assert) and [supertest](https://github.com/visionmedia/supertest#readme)
- **Error handling**: centralized error handling mechanism
- **Dependency management**: with [Yarn](https://yarnpkg.com)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **CI**: continuous integration with [Github Actions](https://github.com/actions)
- **Docker support**
- **Code coverage**: using [c8](https://github.com/bcoe/c8#readme) and [nyc](https://istanbul.js.org/)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)

## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn prod
```

Testing:

```bash
# run all tests with coverage
yarn test:all

# run unit tests with coverage
yarn test:unit

# run integration tests with coverage
yarn test:integration

# run e2e test with coverage
yarn test:e2e
```

Docker:

```bash
# run docker container in development mode
yarn docker:dev

# run docker container in production mode
yarn docker:prod
```

## Environment Variables

The environment variables can be found and modified in the `.env` folder. They come with these default values:

```bash
# Port number(default 3000)
PORT=3000

# URL of the Mongo DB (required)
MONGODB_URL=mongodb://127.0.0.1:27017/fleetManagement

```

## Project Structure

```
.env\
 |--dev.env         # Definitions of development environment
 |--prod.env        # Definitions of production environment
 |--test.env        # Definitions of test environment
```
```
.github\
 |--workflows\      # CI pipeline configuration files
```

```
coverage\           # Test coverage logs
```

```
src\
 |--config\         # Environment variables and configuration related things
 |--controller\     # Route controllers (controller layer)
 |--enums\          # Definitions about constant enums
 |--middleware\     # Custom express middlewares
 |--model\          # Mongoose models 
 |--repository\     # Database logic (data layer)
 |--route\          # Routes
 |--service\        # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validation\     # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```

```
tests\
 |--e2e\            # Custom acceptance scenario tests
 |--fixture\        # Mock data stack for tests
 |--integration\    # Integration test scenarios
 |--unit\           # Business and database logic test scenarios
 |--utils\          # Utility classes and functions
```

## API Documentation

### API Endpoints

List of available routes:

**Delivery routes**:\
`GET  /api/delivery` - get all deliveries\
`POST /api/delivery` - to start distribution process\
`GET  /api/delivery/status/:statusCode` - get deliveries by status\
`GET  /api/delivery/packet` - get deliveries type of "Packet"\
`POST /api/delivery/packet` - to create "Packet"\
`GET  /api/delivery/bag` - get deliveries type of "Bag"\
`POST /api/delivery/bag` - to create "Bag"\
`PUT  /api/delivery/bag/:bagBarcode` - to load "Packet" into "Bag"

**Delivery Point routes**:\
`GET  /api/delivery-point` - get all delivery points\
`POST /api/delivery-point` - to create delivery point

**Vehicle routes**:\
`POST /api/vehicle` - to create vehicle

**Log routes**:\
`GET /api/log` - get all logs from database

## Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). 

```javascript
const controller = async (req, res, next) => {
    try {
        res.status(httpStatus.OK).send();
    } catch (error) {
        next(error);
    }
}
```

The error handling middleware sends an error response, which has the following format:

```json
{
  "code": 404,
  "message": "Not found"
}
```

When running in development mode, the error response also contains the error stack.

The app has a utility ApiError class to which you can attach a response code and a message, and then throw it from anywhere.

For example, if you are trying to load packet to bag who is not found, and you want to send a 400 error, the code should look something like

```javascript
const loadIntoBag: async (bagBarcode, packetBarcodes) => {
    const bag = await bagRepository.getByBarcode(bagBarcode);
    if (!bag) 
    {
        throw new ApiError(httpStatus.BAD_REQUEST, "Bag not found")
    }
};
```

## Validation

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validations` directory and are used in the routes by providing them as parameters to the `validate` middleware from [express-validation](https://github.com/andrewkeig/express-validation)

```javascript
import express from 'express';
import { validate } from 'express-validation';
import someController from '../controller/some.js';
import { someValidation } from '../validation/index.js';

const router = express.Router();

router
    .route('/')
    .post(validate(someValidation.expectedRequestBody), someController.postFunction)
    

export default router;
```


## Logging

Import the logger from `src/config/logger.js`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```javascript
import logger from'<path to src>/config/logger.js';

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

In development mode, log messages of all severity levels will be printed to the console.

Note: API request information (request url, response code, timestamp, etc.) are also automatically logged (using [morgan](https://github.com/expressjs/morgan)).

## Custom Mongoose Plugins

The app also contains 1 custom mongoose plugin that you can attach to any mongoose model schema.

```javascript
import mongoose from "mongoose";
import toJson from '@meanie/mongoose-to-json';

const Schema = mongoose.Schema;
const model = mongoose.model;

const log = new Schema(
    {
        description: {
            type: String,
            required: true
        },
        stack: {
            type: Object,
            default: {}
        }
    },
    {
        timestamps: true,
    }
)

// add plugin that converts mongoose to json
log.plugin(toJson);

export const Log = model('Log', log, 'Log');
```

### toJSON

The toJSON plugin applies the following changes in the toJSON transform call:

- removes \_\_v, createdAt, updatedAt, and any schema path that has private: true
- replaces \_id with id

## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

## CI Process and Deployment

[Github Actions](https://github.com/actions) starts 3-step pipeline when push master branch.

### CI Pipeline

Pipeline has following 3 steps:

- Build app
- Run tests
- Build Docker image and push to [Docker Hub](https://hub.docker.com/)

### Deployment

After successful pipeline, latest image pushes to private [Docker Hub Repository](https://hub.docker.com/repository/docker/arfrodiyaz/fleet-management). To deploy this app, run following code on your server's bash:

```bash
# authenticate docker hub repo
docker login -u arfrodiyaz -p Fl33t-m4n4g3m3nt
```

```bash
# pull latest image to your server
docker pull arfrodiyaz/fleet-management:latest
```

```bash
# run docker container on specific port number (default 3000)
docker run --name fleet-management-api -p 3000:3000 -d arfrodiyaz/fleet-management:latest
```

You can use [traefik](https://traefik.io/) with [Docker Compose](https://docs.docker.com/compose/gettingstarted/) for reverse proxy

### Current Production

You can access API on following url currently :

http://104.198.199.113:3000/
