const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false,
    }
);

async function checkDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database.');

        // Show all tables
        const [results] = await sequelize.query("SHOW TABLES");
        console.log('\n📂 **Database Tables:**');
        results.forEach(row => {
            console.log(` - ${Object.values(row)[0]}`);
        });

        // Show Users
        const [users] = await sequelize.query("SELECT id, fullName, collegeEmail, usn FROM users");
        console.log('\n👤 **Users Table Content:**');
        if (users.length === 0) {
            console.log(' (No users found)');
        } else {
            console.table(users);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkDatabase();
