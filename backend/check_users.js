const { User, Alumni, sequelize } = require('./Models/db');

async function checkUsers() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const userCount = await User.count();
        const alumniCount = await Alumni.count();

        console.log(`Students (User) Count: ${userCount}`);
        console.log(`Alumni Count: ${alumniCount}`);

        if (userCount > 0) {
            const users = await User.findAll({ attributes: ['id', 'fullName', 'collegeEmail'] });
            console.log('Students:', JSON.stringify(users, null, 2));
        }

        if (alumniCount > 0) {
            const alumni = await Alumni.findAll({ attributes: ['id', 'fullName', 'collegeEmail'] });
            console.log('Alumni:', JSON.stringify(alumni, null, 2));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkUsers();
