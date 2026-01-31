const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const PlacementDrive = require('./PlacementDrive');

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.ENUM('Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected'),
        defaultValue: 'Applied'
    },
    resume: { type: DataTypes.STRING }
});

// Define Relationships
User.hasMany(Application, { foreignKey: 'userId' });
Application.belongsTo(User, { foreignKey: 'userId' });

PlacementDrive.hasMany(Application, { foreignKey: 'driveId' });
Application.belongsTo(PlacementDrive, { foreignKey: 'driveId' });

module.exports = Application;
