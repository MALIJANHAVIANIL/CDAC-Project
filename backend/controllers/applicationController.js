const Application = require('../models/Application');
const PlacementDrive = require('../models/PlacementDrive');

const applyForDrive = async (req, res) => {
    const { userId, driveId } = req.query;

    try {
        const existingApplication = await Application.findOne({
            where: { userId, driveId }
        });

        if (existingApplication) {
            res.status(400).json({ message: 'Already applied' });
            return;
        }

        const application = await Application.create({
            userId,
            driveId,
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
};

const getUserApplications = async (req, res) => {
    const { userId } = req.params;

    try {
        const applications = await Application.findAll({
            where: { userId },
            include: [{ model: PlacementDrive }]
        });

        const result = applications.map(app => ({
            ...app.PlacementDrive.toJSON(),
            status: app.status,
            appliedAt: app.createdAt,
            applicationId: app.id
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { applyForDrive, getUserApplications };
