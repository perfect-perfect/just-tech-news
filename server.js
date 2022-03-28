// we use 'path' below in the app.use(express.static)
const path = require('path');
const express = require('express');
// the router instance in routes/index.js collected everything for us and packaged them up for the server.js to use
const routes = require('./controllers');
// importing the connection to Sequelize from config/connection.js
const sequelize = require('./config/connection');
// the 'express-session' library allows us to connect cookies at the back end
// 'sessions' allow our Express.js server to keep track of which user is making a request, and store useful data about them in memory
const session = require('express-session')
// 'connect-session-sequelize' library automatically stores the sessions created by 'express-session' into our database
// we use this below, we use it in on of the properties we create for  const = sess
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// for sessions
// we place this variable in app.use() below
const sess = {
    // As you may be able to guess. 'Super secret secret' should be replaced by an actual secret and stored in the '.env' file
    secret: 'Super secret secret',
    // All we need to do to tell our session to use cookies is to set 'cookie' to '{}'
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};
const helpers = require('./utils/helpers');


const app = express();
const PORT = process.env.PORT || 3001;

// for sessions
app.use(session(sess));

// Handlebars.js setup as template engine (chapter doesn't go into detail)
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//  - the 'express.static()' method 
//      - a built-in Express.js middleware function that can take all of the contents of a folder and serve them as static assets
//      - this is useful for front-end specific files like images, stylesheets, and JavaScript files.
app.use(express.static(path.join(__dirname, 'public')));


// turn on routes
// since we set up the routes the way we did, we don't have to worry about importing multiple files for differrent endpoints
app.use(routes);


// turn on connection to db and server
// we use the 'sequelize.sync()' method to establish the sequelize connection to the database
// the 'sync' part means that this is Sequelize taking the models and connecting them to associated database tables
//  - if it doesn't find a table, it'll create it for you!
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});