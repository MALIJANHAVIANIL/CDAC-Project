const { sequelize } = require('./config/db');
const User = require('./models/User');

const checkUser = async () => {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { email: 'abhi@gmail.com' } });
        console.log('User found:', JSON.stringify(user, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

checkUser();
