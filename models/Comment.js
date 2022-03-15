const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // text of the comment
        comment_text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4]
            }

        },
        // who made the post
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        // what post the vote belongs to
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id'
            }
        }

    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'comment'
    }
);

// Note that we don't have to specificy 'Comment' as a through table like we did for 'Vote.' 
//  - this is because we don;t need to access 'Post' through 'Comment'
//      - we just want to see the user's comment and which post it was for
//      - thus the query is slightly different

module.exports = Comment;