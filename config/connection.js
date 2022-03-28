// import the Sequelize constructor from the library 
const Sequelize = require('sequelize');

// to set these production/local environemnts up
require('dotenv').config();

// cthis connection allows you use JawsDB on Heroku, which allows you to host your app on Heroku
// create connection to our database, pass in your MySQL information for username and password
// declaring a variable as const without setting it equal to a value will throw an error
//  - that is why we use 'let'
let sequelize;

if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
    });
}

module.exports = sequelize;