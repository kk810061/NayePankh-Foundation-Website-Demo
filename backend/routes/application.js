const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {applyProgram, getMyApplications, getApplications, updateApplication, deleteApplication} = require('../controllers/application');

router.post('/:programId', auth, applyProgram);
router.get('/my', auth, getMyApplications);
router.get('/', auth, admin, getApplications);
router.patch('/:id/status', auth, admin, updateApplication);
router.delete('/:id', auth, admin, deleteApplication);

module.exports = router;