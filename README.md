# Racks Project Manager

## Relevant Endpoints

- POST /login
- POST /loginNft
- POST-GET /projects
- PATCH /users/contributor/:address (Register contributor)
- POST /projects/add-contributor/:address (Add contributor to project)
- POST /projects/completed/:address (Complete project)
- POST /create-local-admin (Create first Admin with local environment values)

## Github

We use Octokit (https://www.npmjs.com/package/octokit) to execute the Github API calls.

```bash
npm i octokit
```

- On Project Created, a new repository with the same name will be created in Racks Community Organization.
- When a Contributor joins a project he receives an invitation to join the repository with write permissions.
- After completting a project, the Contributor will receive an invitation to join the Racks Community Organization.

## Discord

We use the Discord Bot API implementation of discord.js to manage the Racks Dao Server.
First I created a Discord Bot in the developers section (https://discord.com/developers/applications/)

It must have Bot scope with the following permissions:
- Manage Roles
- Manage Channels
- Create Instant Invite

You can use and authorize the Bot I created just by clicking in this url as long as you are the owner of the Discord server
https://discord.com/api/oauth2/authorize?client_id=1012037548362694758&permissions=268435473&scope=bot

### Using discord.js

```bash
npm i discord.js
```

You can find the documentation of discord.js here: https://discord.js.org/#/docs/

Our Discord Implementation:
- On Project Created, a new role with the project's name is created
- On Project Created, a new category channel with the associated text and voice channels will be created with the permissions set so only admins and members with the project role will be able to see and use the new channels.
- When a holder upgrades to Contributor, he receives an invite to the Racks Dao Server.
- When a Contributor joins a project, he will be granted with the project role so he has access to the respective channels.

# Node.js express.js MongoDB JWT WEB 3 REST API // Base Documentation

## Features

- Multiple environment ready (development, production)
- Custom email/password user system with basic security and blocking for preventing brute force attacks.
- Compressed responses.
- Secured HTTP headers.
- CORS ready.
- Cache ready (Redis).
- HTTP request logger in development mode.
- i18n ready (for sending emails in multiple languages).
- User roles.
- Pagination ready.
- Users list for admin area.
- Cities model and controller example.
- Login access log with IP, browser and country location (for country it looks for the header `cf-ipcountry` that CloudFlare creates when protecting your website).
- API autogenerated documentation by Postman.
- API collection example for Postman.
- Testing with mocha/chai for API endpoints.
- NPM scripts for cleaning and seeding the MongoDB database.
- NPM script for keeping good source code formatting using prettier and ESLint.
- Use of ESLint for good coding practices.
- Mailer example with Nodemailer and Mailgun.
- Ability to refresh token
- login web 3
- JWT Tokens, make requests with a token after login with `Authorization` header with value `Bearer yourToken` where `yourToken` is the **signed and encrypted token** given in the response from the login process.

## Requirements

- Node.js **10+**
- MongoDB **3.6+**
- Redis **5.0+**

### Mailer

To ensure the deliverability of emails sent by this API, `Mailgun` is used for mailing users when they sign up, so if you want to use that feature go sign up at their website <https://www.mailgun.com>

If you want to try a different method it´s ok, I used <https://nodemailer.com> for this API and they have different transport methods like: smtp.

### i18n

Language is automatically detected from `Accept-Language` header on the request. So either you send locale manually on the request or your browser will send its default, if `Accept-Language` header is not sent then it will use `en` locale as default.

## How to run

### Database cleaning and seeding samples

There are 3 available commands for this: `fresh`, `clean` and `seed`.

```bash
npm run command
```

- `fresh` cleans and then seeds the database with dynamic data.
- `clean` cleans the database.
- `seed` seeds the database with dynamic data.

### Running in development mode (lifting API server)

```bash
npm run dev
```

You will know server is running by checking the output of the command `npm run dev`

```bash
****************************
*    Starting Server
*    Port: 3000
*    NODE_ENV: development
*    Database: MongoDB
*    DB Connection: OK
****************************
```

### Running tests

It´s a good practice to do tests at your code, so a sample of how to do that in `mocha/chai` is also included in the `/test` directory

```bash
npm run test
```

### Formatting code

Format your code with prettier by typing:

```bash
npm run format
```

### Formatting markdown files

Format all your markdown files with remark by typing:

```bash
npm run remark
```

### Linting code

Lint your code with ESLint by typing:

```bash
npm run lint
```

### API documentation

<https://documenter.getpostman.com/view/3889100/VUjSHQDn>

### Postman API example collection

You can import the example collection to Postman. To import, click the import button located and select `postman-example.json` located within the root directory.

Go to `manage environments` to create environments for development, production, etc. On each of the environments you create you will need to:

1.  Create a new key `authToken` and within the `/login` request this value is automatically updated after a successfull login through a script located in the `tests` tab. Each time you make a request to the API it will send `Authorization` header with the `token` value in the request, you can check this on the headers of users or cities endpoints in the Postman example.

2.  Create a second key `server` with the url of your server, for development mode use <http://localhost:3000>
