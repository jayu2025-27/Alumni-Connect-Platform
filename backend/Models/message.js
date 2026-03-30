const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Message = sequelize.define('Message', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        senderRole: {
            type: DataTypes.ENUM('student', 'alumni'),
            allowNull: false
        },
        conversationId: {
            type: DataTypes.INTEGER,
            allowNull: true // Can be part of a conversation
        }
    }, {
        timestamps: true
    });

    return Message;
};
