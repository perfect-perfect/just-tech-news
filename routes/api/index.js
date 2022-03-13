// this file will collect all the api routes

const router = require('express').Router();

const userRoutes = require('./user-routes');
const postRoutes = require('./post-routes');

// url prefixes
router.use('/users', userRoutes);
router.use('/posts', postRoutes);


module.exports = router;