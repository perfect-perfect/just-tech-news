// this home_routes.js will contain all of the user-facing routes, such as the homepage and login page.

const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// home page route that gets all the posts
router.get('/', (req, res) => {
    console.log(req.session);
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id)'), 'vote_count']
        ],
        include: [
            {
                // Note that the included 'Comment' model will also include the 'User' model itself
                //  - so it can attach the username to the comment
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']   
            }
        ]
    })
        .then(dbPostData => {
            // The data that Sequelize returns is actually a Sequelize object with a lot more information attached to it than you might have been expecting
            //  - to serialize the object down to only the properties you need, you can use Sequelize's 'get()' method ***
            //  - you didn't need to serialize data before when you built API routes, because the 'res.json()' method automatically does that for you
            // This will loop over and map each Sequelize object into a serialized verson of itself, saving the results in a new 'posts' array.
            //  - now we can plug that array into the template.
            const posts = dbPostData.map(post => post.get({ plain: true }));
            // Because we've hooked up a template engine, we can now use 'res.render()' and specify which template we want to use
            //  - in this case we want to we want to render the 'homepage.handlebars' template
            //      - the '.handlebars' extension is implied
            //  - it then takes the html at homepage.handlebars and makes available to it all the properties of { posts }
            //      - from within the handlebars files
            //          - two curly brackets '{{}}' will convert what ever you getting into a string
            //          - three curly brackets '{{{}}}' allows it to remain HTML
            // { posts }
            //  - even though the 'render()' method can accept an array instead of an object, that would prevent us from adding other properties to the template later on
            //      - this will momentarily break the template again because the template was set up to receive an object with an 'id' property, 'title' property and so on
            //      - now the only property it has access to is the 'posts' array. 
            //      - fortunately Handlebars.js has built-in 'helpers' that will allow you to perform minimal logic like looping over an array
            //          - the {{#each posts as |post|}} and {{/each}} in 'homepage.handlebars'
            //              - //      - any html code in between (eg, the '<li>' element) will be repeated for every item in 'posts'
            res.render('homepage', { 
                // each property on the object 'id', 'post_url', 'title' becomes available in the template using the Handlebars.js '{{}}' syntax
                //  - example:
                //      - {{post.post_url}} is used in hompage.handlebars
                // When we pass the 'post' object into the partials, we don't pass the object as is, but rather pass in all of the properties of that object
                posts,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// if someone clicks on comment this gets us the singple post page
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            // serialize the data
            const post = dbPostData.get({ plain: true });
            

            // pass data to template
            res.render('single-post', { 
                // When we pass the 'post' object into the partials, we don't pass the object as is, but rather pass in all of the properties of that object
                post,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// renders login, if the url ends in '/login'
router.get('/login', (req,res) => {
    // check for a session and redirect to the homepage if one exists by adding the following code:
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    // Our login page doesn't need any variables, so we don't need to pass a second argument to the 'render()' method
    res.render('login');
})

module.exports = router;