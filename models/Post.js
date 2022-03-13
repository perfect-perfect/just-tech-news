const { Model, DataTypes } = require('sequelize');
// the connection to MySql we stored in in the connection.js file
const sequelize = require('../config/connection');

// Create our Post model
class Post extends Model {
    // we're using JavaScripts built-in 'static' keyword 
    //  - to indicate that the 'upvote' method is one that's based on the 'Post' model and not an instance method (like we used earlier in the 'User' model)
    //  - we'll pass in the value of req.body (as body) and an object of the models (as models)
    static upvote(body, models) {
        // create a vote
        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() => {
            // then find the post we just voted on
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    // use raw MySQL aggregate function query to get a count of how many votes the post has and return it in the name 'vote_count'
                    // sequelize provides us a special method called '.literal()' 
                    //  - that allows us to run regular SQL queries from within the Sequelize method-based queries.
                    //      - So when we vote on a post, we'll see that post-and its updated vote total-in the response
                    [
                        sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ]
                ]
            });
        });

    }
}

// Create fields/columns for Post model
Post.init(
    {
        id: {
            // we define it as a Interger value
            type: DataTypes.INTEGER,
            allowNull: false,
            // we make id the primary key
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            // sequelize has the ability to offer validation in the schema definition
            validate: {
                // here we ensure that the url is a verified link by setting the 'isURL' property to true
                isURL: true
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            // establishes a relationsip between the post and the user who posted it
            references: {
                model: 'user',
                // this 'id' is the primary key of the User model, so this makes this 'user_id' the foregin key
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;