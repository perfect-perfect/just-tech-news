const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

// Get /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method
    User.findAll({
        //  - notice howe we now pass an object into the method like we do with the findOne() method
        //      - this time we've provided an 'attributes' key and instructed the query to exclude the 'password' column.
        //      - it is any array because if we want to exclude more than one, we just add more
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            //  to include not just the posts they created
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                //  we're including the Post model on the Comment model so we can see on which posts this user commented.
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            // to include the titles of the posts they've voted on
            // we had to include the 'Post' model, as we did before, but this time we had to contextualize it by going through the Vote table
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                // we send a 404 status back to the client to indicate everything's okay and they just asked for the wrong piece of data.
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'lernantino', email: 'lerantino@gmail.com, password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => {
            // this gives our server easy access to the user's 'user_id', 'username', and a Boolean describing whether or not the user is logged in
            // this will save the user's info to the session. Also makes the user info always accesible from req.session
            // we want to make sure the session is created before we send the response back, so we're wrapping the variables in a callback 
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                // we use loggedIn later to determine whether a user is logged in
                req.session.loggedIn = true;

                res.json(dbUserData);
            });

        })
});

// login verification
// we used POST because the request paramater is located in req.body
router.post('/login', (req, res) => {
    // expects { email: 'lernantino@gmail.com', password: 'password1234' }
    // we queried the 'User' table using the findOne() method for the email entered by the user and assigned it to req.body.email.
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!'});
            return;
        }
        
        // res.json({ user: dbUserData });

        // Verify user
        // - if the query result is succesfull (i.e., not empty) we can call '.checkPassword()
        //      - which will be in the dbUserData object. It is in that object because the object was created by the User model and in that we have the funcion. 
        //  - the '.compareSync()' method can then confirm or deny that the supplied password matches the hashed password stored on the object.
        //      - this function is part of sequelize
        //  - - .checkPassword() will then true on success and false on faliure
        //  - req.body.password is the password submitted by the user
        const validPassword = dbUserData.checkPassword(req.body.password);
        
        // because the instance method returns a Boolean, we can use it in a conditional statement to verify whether the user has been verified or not
        // if the match returns a 'false' and then the return statement exists our of the function immediately
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
        // creates the session
        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
        
            // if there is a match, the conditional statement block is ignored, and a response with the data and the message "You are now logged in." is sent instead.
            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});

// Logout
// we just a javascript function and fetch later to trigger this route if someone clicks on the logout button
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        // we can then use the 'destroy()' method to clear the session
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});

// UPDATE User
// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        // Before we can check to see if this hook is effective however, we must add an option to the query call
        // this is because of the beforeUpdate() in the hooks of the User.init() in User.js
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
      .then(dbUserData => {
        if (!dbUserData[0]) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            } 
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        }); 
});

module.exports = router;
