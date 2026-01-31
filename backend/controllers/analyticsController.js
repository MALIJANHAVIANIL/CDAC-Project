const User = require('../models/User');
const PlacementDrive = require('../models/PlacementDrive');
const Application = require('../models/Application');

const getStudentStats = async (req, res) => {
    try {
        const totalDrives = await PlacementDrive.count();
        const applied = await Application.count();

        const upcomingDrives = await PlacementDrive.findAll({
            limit: 3,
            order: [['date', 'ASC']],
            where: {
                date: {
                    [require('sequelize').Op.gte]: new Date()
                }
            }
        });

        res.json({
            totalDrives,
            applied,
            selected: 0,
            rejected: 0,
            upcomingDrives
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getTpoStats = async (req, res) => {
    try {
        const totalStudents = await User.count({ where: { role: 'STUDENT' } });
        const activeDrives = await PlacementDrive.count();
        const applications = await Application.count();
        const placedStudents = await Application.count({ where: { status: 'Selected' } });

        res.json({
            totalStudents,
            placedStudents,
            activeDrives,
            avgPackage: "0 LPA"
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getStudentStats, getTpoStats };
