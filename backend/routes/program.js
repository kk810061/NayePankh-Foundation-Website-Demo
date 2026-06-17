const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {createProgram, getPrograms, getSingleProgram, updateProgram, deleteProgram} = require('../controllers/program');

router.post('/', auth, admin, createProgram);
router.get('/', getPrograms);
router.get('/:id', getSingleProgram);
router.route('/:id').patch(auth, admin, updateProgram).delete(auth, admin, deleteProgram);

module.exports = router;

