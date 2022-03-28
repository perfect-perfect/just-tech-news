const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

// the associations go inside the models/index.js
// create associations
User.hasMany(Post,  {
    foreignKey: 'user_id'
});

// this is us creating the reverse of above. 
// in this statement we are defining the relationship of the 'Post' model to the 'User'
// the constraint we impose here is that a post can belong to one user, but not many users
Post.belongsTo(User, {
    // link to the foregin key
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});

// the following two connect User and Post through the Vote table
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id',
    onDelete: 'SET NULL'
});

//the next four connect 'Post' and 'User' directly to 'Vote'
Vote.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'SET NULL'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

// Comment Associations
Comment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'SET NULL'
});

User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id',
    
});


module.exports = { User, Post, Vote, Comment };