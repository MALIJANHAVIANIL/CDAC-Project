const { sequelize } = require('./config/db');
const User = require('./models/User');

const checkUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL');
        const users = await User.findAll();
        console.log('Users found:', JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

checkUsers();
