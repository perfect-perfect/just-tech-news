const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// route methods like '.get()' and '.post()' can receive a dynamic number of arguments or callback functions
//  - calling 'next()' in one of these functions calls the next middleware function, passing along the same 'req' and 'res' values
//      - in this case the withAuth function we are importing ends with a 'next()' 
router.get('/', withAuth, (req,res) => {
    Post.findAll({
        // because the dashboard should only display posts created by the logged in user
        //  - you need to add a 'where' object to the 'findAll()' query that uses the id saved on the session.
        where: {
            // Use the id from the session
            user_id: req.session.user_id
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
            // serialize data before passing to template
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.render('dashboard', { posts, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// ful url is dashboard/edit/3 remember this is the dashboard routes
router.get('/edit/:id', withAuth, (req, res) => {
    // Here we get all the information we are going to need in the handlebars
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            // this needs review ???
            [sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id =vote.post_id)'), 'vote_count']
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
            //  - the data that Sequelize returns is actually a Sequelize object with a lot more information attached to it than you might have been expecting
            //      - to serialize the object down to only the properties you need, you can use Sequelize's 'get()' method ***
            //  - this will loop over and map each Sequelize object into a serialized verson of itself, saving the results in a new 'post' array.
            //  - it appears seralize means it takes only the fields we requested above and extracts them from theSequelize object, and it creates an array of objects
            const post = dbPostData.get({ plain: true });

            // we send it to 'edit-post.handlebars, along with an object with two things, the serialized post data and the loggedIn variable which verifies if we're logged in using the session.loggedIn
            res.render('edit-post', {
                post,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })

})

module.exports = router;