const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Alumni = sequelize.define('Alumni', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        graduationYear: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        collegeEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        linkedin: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true
            }
        },
        degreeCertificate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profilePhoto: {
            type: DataTypes.STRING,
            allowNull: false
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        role: {
            type: DataTypes.ENUM('alumni'),
            allowNull: false,
            defaultValue: 'alumni'
        }
    }, {
        timestamps: true
    });

    return Alumni;
};
