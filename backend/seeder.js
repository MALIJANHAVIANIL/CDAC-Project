const dotenv = require('dotenv');
const { sequelize } = require('./config/db');
const User = require('./models/User');
const PlacementDrive = require('./models/PlacementDrive');
const Application = require('./models/Application');

dotenv.config();

const importData = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true }); // Drop and recreate tables

        const users = [
            {
                name: 'Student User',
                email: 'student@example.com',
                password: 'password123',
                role: 'STUDENT',
                branch: 'CSE',
                cgpa: 8.5
            },
            {
                name: 'TPO Admin',
                email: 'admin@example.com',
                password: 'adminpassword',
                role: 'ADMIN'
            }
        ];

        // Bulk create triggers hooks in Sequelize v6+ with individualHooks: true, 
        // but here we can just create one by one or trust the hook logic.
        // For bcrypt hook to work in bulkCreate, we need specific options.
        // Simpler to just loop for this small seeder.

        for (const user of users) {
            await User.create(user);
        }

        const drives = [
            {
                companyName: "TechCorp",
                role: "Software Engineer",
                package: "12 LPA",
                location: "Bangalore",
                date: "2024-02-15",
                description: "Leading tech company looking for freshers.",
                eligibility: "BE/B.Tech CS/IT",
                deadline: "2024-02-10",
                type: "Full Time"
            },
            {
                companyName: "InnovateLabs",
                role: "Data Scientist",
                package: "15 LPA",
                location: "Pune",
                date: "2024-02-20",
                description: "Hiring for AI/ML roles.",
                eligibility: "BE/B.Tech",
                deadline: "2024-02-12",
                type: "Internship + PPO"
            }
        ];

        await PlacementDrive.bulkCreate(drives);

        console.log('MySQL Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await sequelize.sync({ force: true }); // Clears everything
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
