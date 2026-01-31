const express = require('express');
const router = express.Router();
const { applyForDrive, getUserApplications } = require('../controllers/applicationController');

router.post('/apply', applyForDrive);
router.get('/user/:userId', getUserApplications);

module.exports = router;
