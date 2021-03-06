const sequelize = require('../../config/connection');
const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../../models');
const withAuth = require('../../utils/auth')

// get all posts
router.get('/', (req, res) => {
    console.log('====================');
    Post.findAll({
        // the 'order' property is assigned a nested array that orders by the 'created_at' column in descending order *** this is ommited later in the chapter, keeping this here for now
        order: [['created_at', 'DESC']],
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        // we'll include the JOIN to the User table. We do this by adding the property 'include'
        // this is the foregin key here, but it is the primary key in the user table
        include: [
            // include the Comment model here:
            // Note that the included 'Comment' model will also include the 'User' model itself
            //  - so it can attach the username to the comment
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
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at'],
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
            res.json(dbPostData);
        })
        .catch(err => {
            res.status(500).json(err)
        });
});

// create a post
router.post('/', withAuth, (req, res) => {
    // expects {title: 'Taskmaster goes public!, post_url: 'http://taskmaster.com/press', user_id: 1}
    Post.create({
        // assign title, post_url, user_id to the properties in the req.body object
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.session.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// PUT /api/posts/upvote
// create vote
//  - make sure this PUT route is defined before the '/:id' PUT route
//      - otherwise, Express.js will think the word "upvote" is a valid parameter for '/:id' ***
// cutsom static method created in models/Post.js
router.put('/upvote', withAuth, (req, res) => {
    // make sure the session exists first
    if (req.session) {
        // pass session id along with all destructured properties on req.body
        // when 'req.body' gets here it looks like this { post_id: '1'}
        Post.upvote({...req.body, user_id: req.session.user_id}, { Vote, Comment, User })
            .then(updatedVoteData => res.json(updatedVoteData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
});

// Update a post's title
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        //  replace the value of title with the req paramater 'req.body.title'
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id'});
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// delete a post
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


module.exports = router;