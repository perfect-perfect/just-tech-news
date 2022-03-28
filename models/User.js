const  { Model, DataTypes } = require('sequelize');
// the connection to MySql we stored in in the connection.js file
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {
    // instance method
    // - we should create an instance method on the 'User' model definition to access the password property for each user instance
    // - do instances always go where we create our new model?
    // set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        //  - this method will include the 'compareSync' function from bcrypt
        //  - using the keyword 'this', we can access this user's properties
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// define table columns and configuration
// '.init()' method provides context as to how inherited methods should work
User.init(
    {
        // define id column
        id: {
            // use the special Sequalize DataTypes object to provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's 'NOT NULL' option
            allowNull: false,
            // instruct that this is the Primary Key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        //define a username column 
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate e-mail values in this table
            unique: true,
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
            // set up beforeCreate() lifecycle "hook" functionality
            // we use the 'beforeCreate()' hook to execute the 'bcrypt' hash function on the plaintext password
            //- the 'async' keyword is used as a prefix to the function that contains the asynchronous function
            //  await can be used to prefix the async function, which will then gracefully assign the value from the response to the newUserData's password property
            async beforeCreate(newUserData) {
                // we assign newUserData.password to the hashed pasword, but it awaits it before returning it
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },

            // set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
            
        },
        // TABLE CONFIGURATION OPTIONS FO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))
        // pass in our imported sequelize connection 
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscored instead of camel-casing (i.e. `comment_text`)
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;