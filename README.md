# Web App Kit 2

## Development Setup

**Required:** Make sure you have [NodeJS](https://nodejs.org/en/) and [Pm2](http://pm2.keymetrics.io/) installed on your computer. You will also need MySQL installed. You can use whatever you want, whether its MAMP, WAMP, or installing MySQL directory through terminal on your Mac.

Within the root directory, run `npm install` to install all dependencies related to building the Front End.

For the API, run `npm install` within the `/api` folder. Next, edit the `/api/db-config.js` accordingly. Within the `/api/routes` folder, you will find `user.js`. In this file you will see the *User* table structure for **Sequelize**. You can follow this pattern for other tables you may create within your MySQL database. Once tables are created as defined within the file, you can run your API server with the following command `pm2 start index.js -n myServer` within the `/api` folder.