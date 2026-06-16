const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {createVolunteer, getAllVolunteers, updateVolunteer, deleteVolunteer} = require('../controllers/volunteer');

router.post('/', auth, createVolunteer);
router.get('/', auth, admin, getAllVolunteers);
router.patch('/:id/status', auth, admin, updateVolunteer);
router.delete('/:id', auth, admin, deleteVolunteer);

module.exports = router;
