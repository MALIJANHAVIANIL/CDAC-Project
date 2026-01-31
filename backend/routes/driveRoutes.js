const express = require('express');
const router = express.Router();
const { getActiveDrives, createDrive } = require('../controllers/driveController');
// const { protect, admin } = require('../middleware/authMiddleware'); 
// TODO: Implement middleware

router.get('/active', getActiveDrives);
router.post('/', createDrive);

module.exports = router;
