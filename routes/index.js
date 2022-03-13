const router = require('express').Router();

const apiRoutes = require('./api');

// the router instance here collectes everything for us and packages them up for the server.js to use
//  - so we don't have to import all the routes to the server
router.use('/api', apiRoutes);

router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;