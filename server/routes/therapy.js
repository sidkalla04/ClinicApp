const express = require('express');
const router = express.Router();
const { updateTherapySession, deleteTherapySession } = require('../controllers/therapyController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/:sessionId').put(updateTherapySession).delete(deleteTherapySession);

module.exports = router;
