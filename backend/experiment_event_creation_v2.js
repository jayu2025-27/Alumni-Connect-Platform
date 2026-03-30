
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Event = sequelize.define('Event', {
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false
        // Removed strict validation
    },
    dateTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

async function testEventCreation() {
    await sequelize.sync();

    const tests = [
        { link: 'https://google.com', shouldPass: true },
        { link: 'http://google.com', shouldPass: true },
        { link: 'google.com', shouldPass: true }, // Should now pass
        { link: 'To join click https://google.com', shouldPass: true }, // Should now pass
        { link: 'not a url', shouldPass: true } // Should now pass
    ];

    for (const test of tests) {
        try {
            await Event.create({
                description: 'Test Event',
                link: test.link,
                dateTime: new Date(),
                category: 'Test'
            });
            console.log(`[PASS] Link: "${test.link}" - Created successfully`);
        } catch (error) {
            console.log(`[FAIL] Link: "${test.link}" - Creation failed: ${error.message}`);
        }
    }
}

testEventCreation();
