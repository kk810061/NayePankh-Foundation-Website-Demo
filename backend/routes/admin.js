const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const getDashboardStats = require('../controllers/admin');

router.route('/stats', auth, admin).get(getDashboardStats);

module.exports = router;