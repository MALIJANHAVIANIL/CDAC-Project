const express = require('express');
const router = express.Router();
const { getStudentStats, getTpoStats } = require('../controllers/analyticsController');

router.get('/student-stats', getStudentStats);
router.get('/tpo-stats', getTpoStats);

module.exports = router;
