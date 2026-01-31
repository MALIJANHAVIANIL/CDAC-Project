const PlacementDrive = require('../models/PlacementDrive');

const getActiveDrives = async (req, res) => {
    try {
        const drives = await PlacementDrive.findAll();
        res.json(drives);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const createDrive = async (req, res) => {
    try {
        const drive = await PlacementDrive.create(req.body);
        res.status(201).json(drive);
    } catch (error) {
        res.status(400).json({ message: 'Invalid drive data', error: error.message });
    }
};

module.exports = { getActiveDrives, createDrive };
