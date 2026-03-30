const { Sequelize } = require('sequelize');
require('dotenv').config();

// Ensure required environment variables are present
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'];
const missingVars = requiredEnvVars.filter(key => process.env[key] === undefined);

if (missingVars.length > 0) {
    console.error('ERROR: Missing required environment variables for database connection:', missingVars.join(', '));
    // We don't exit here to allow testConnection to fail gracefully later, but it's good to log.
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false, // Set to console.log for debugging SQL
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Database connected successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database.');
        console.error('Error details:', error.message);
        throw error;
    }
}

// Import models
const User = require('./users')(sequelize);
const Alumni = require('./alumni')(sequelize);
const Message = require('./message')(sequelize);
const Conversation = require('./conversation')(sequelize);
const Event = require('./event')(sequelize);
const Job = require('./job')(sequelize);
const Mentorship = require('./mentorship')(sequelize);

// Define Associations

// User follows User
User.belongsToMany(User, { as: 'Followers', through: 'UserFollows', foreignKey: 'followingId', otherKey: 'followerId' });
User.belongsToMany(User, { as: 'Following', through: 'UserFollows', foreignKey: 'followerId', otherKey: 'followingId' });

// User follows Alumni
User.belongsToMany(Alumni, { as: 'FollowingAlumni', through: 'UserAlumniFollows', foreignKey: 'userId', otherKey: 'alumniId' });
Alumni.belongsToMany(User, { as: 'Followers', through: 'UserAlumniFollows', foreignKey: 'alumniId', otherKey: 'userId' });

// Conversation & Message
Conversation.hasMany(Message, { foreignKey: 'conversationId' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

// Conversation Participants (Strict 1 Student and 1 Alumni)
Conversation.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });
Conversation.belongsTo(Alumni, { as: 'AlumniUser', foreignKey: 'alumniId' });
User.hasMany(Conversation, { foreignKey: 'studentId' });
Alumni.hasMany(Conversation, { foreignKey: 'alumniId' });

// Message Sender/Receiver
Message.belongsTo(User, { as: 'SenderStudent', foreignKey: 'senderId', constraints: false });
Message.belongsTo(User, { as: 'ReceiverStudent', foreignKey: 'receiverId', constraints: false });
Message.belongsTo(Alumni, { as: 'SenderAlumni', foreignKey: 'senderId', constraints: false });
Message.belongsTo(Alumni, { as: 'ReceiverAlumni', foreignKey: 'receiverId', constraints: false });


module.exports = {
    sequelize,
    testConnection,
    User,
    Alumni,
    Message,
    Conversation,
    Event,
    Job,
    Mentorship
};