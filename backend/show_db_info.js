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

async function showDatabaseInfo() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database: ' + process.env.DB_NAME);
        console.log('='.repeat(80));

        // Show all tables
        const [tables] = await sequelize.query("SHOW TABLES");
        console.log('\n📂 DATABASE TABLES:\n');
        tables.forEach(row => {
            console.log(` - ${Object.values(row)[0]}`);
        });

        console.log('\n' + '='.repeat(80));
        console.log('\n📋 CREATE TABLE STATEMENTS:\n');

        // Get CREATE TABLE statement for each table
        for (const row of tables) {
            const tableName = Object.values(row)[0];
            const [createStmt] = await sequelize.query(`SHOW CREATE TABLE \`${tableName}\``);
            console.log(`-- Table: ${tableName}`);
            console.log(createStmt[0]['Create Table']);
            console.log('\n');
        }

        console.log('='.repeat(80));
        console.log('\n📊 SAMPLE DATA:\n');

        // Show sample data from users table
        const [users] = await sequelize.query("SELECT * FROM users LIMIT 5");
        console.log('Users Table:');
        if (users.length === 0) {
            console.log('  (No data)');
        } else {
            console.table(users);
        }

        // Show sample data from alumnis table
        const [alumnis] = await sequelize.query("SELECT * FROM alumnis LIMIT 5");
        console.log('\nAlumnis Table:');
        if (alumnis.length === 0) {
            console.log('  (No data)');
        } else {
            console.table(alumnis);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

showDatabaseInfo();
