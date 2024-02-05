const router = require('express').Router();

const apiRoutes = require('./api');
const userRoutes = require('./user');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);

module.exports = router;