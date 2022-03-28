const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes')

const dashboardRoutes = require('./dashboard-routes.js');

// the router instance here collectes everything for us and packages them up for the server.js to use
//  - so we don't have to import all the routes to the server
router.use('/api', apiRoutes);

router.use('/', homeRoutes);

router.use('/dashboard', dashboardRoutes);

router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;