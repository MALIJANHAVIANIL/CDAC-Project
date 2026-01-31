const { sequelize } = require('./config/db');
const PlacementDrive = require('./models/PlacementDrive');

const fixDates = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL');

        // Update all drives to have dates in 2026
        const drives = await PlacementDrive.findAll();

        for (const drive of drives) {
            // Set date to 1 month from now
            const newDate = new Date();
            newDate.setFullYear(2026);
            newDate.setMonth(newDate.getMonth() + 1);

            // Set deadline to 20 days from now
            const newDeadline = new Date();
            newDeadline.setFullYear(2026);
            newDeadline.setMonth(newDeadline.getMonth() + 1);
            newDeadline.setDate(newDeadline.getDate() - 10);

            drive.date = newDate;
            drive.deadline = newDeadline;
            await drive.save();
            console.log(`Updated drive: ${drive.companyName} to ${newDate}`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

fixDates();
