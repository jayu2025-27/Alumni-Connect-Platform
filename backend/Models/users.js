const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
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
        isEmail: true // Allow any valid email
      }
    },
    course: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    fieldOfStudy: {
      type: DataTypes.STRING,
      allowNull: false
    },
    linkedin: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    github: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profilePhoto: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: true
  });

  return User;
};