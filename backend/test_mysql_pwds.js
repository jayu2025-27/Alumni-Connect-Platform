const mysql = require('mysql2/promise');
require('dotenv').config();

const passwords = ['', 'root', 'password', '12345678', '1234', 'mysql', 'admin', 'jayu27'];

async function testPasswords() {
    for (const pwd of passwords) {
        try {
            console.log(`Testing password: "${pwd}"`);
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: pwd
            });
            console.log(`✅ SUCCESS! Correct password is: "${pwd}"`);
            await connection.end();
            process.exit(0);
        } catch (error) {
            console.log(`❌ Failed: ${error.message}`);
        }
    }
    console.log('❌ All common passwords failed.');
    process.exit(1);
}

testPasswords();
