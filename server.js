const express = require('express');
// the router instance in routes/index.js collected everything for us and packaged them up for the server.js to use
const routes = require('./routes');
// importing the connection to Sequelize from config/connection.js
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
// since we set up the routes the way we did, we don't have to worry about importing multiple files for differrent endpoints
app.use(routes);

// turn on connection to db and server
// we use the 'sequelize.sync()' method to establish the sequelize connection to the database
// the 'sync' part means that this is Sequelize taking the models and connecting them to associated database tables
//  - if it doesn't find a table, it'll create it for you!
sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});