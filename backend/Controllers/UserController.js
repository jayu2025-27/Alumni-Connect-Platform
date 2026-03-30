const { User } = require('../Models/db');
const { Op } = require('sequelize');

const getUsersForSidebar = async (req, res) => {
    try {
        const currentUser = req.user;
        let users;

        // Check if current user is Alumni (has role 'alumni')
        if (currentUser.role === 'alumni') {
            // If Alumni, fetch Students (User model)
            users = await User.findAll({
                attributes: ['id', 'fullName', 'profilePhoto']
            });
        } else {
            // If Student (User model), fetch Alumni
            users = await require('../Models/db').Alumni.findAll({
                attributes: ['id', 'fullName', 'profilePhoto']
            });
        }

        res.status(200).json({ users });
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to retrieve users' });
        }
    }
};


const getNetworkUsers = async (req, res) => {
    try {
        const students = await User.findAll({
            attributes: ['id', 'fullName', 'profilePhoto', 'course', 'graduationYear', 'fieldOfStudy', 'linkedin']
        });

        const alumni = await require('../Models/db').Alumni.findAll({
            where: { verified: true },
            attributes: ['id', 'fullName', 'profilePhoto', 'graduationYear', 'company', 'jobTitle', 'linkedin']
        });

        res.status(200).json({ students, alumni });
    } catch (error) {
        console.error("Error in getNetworkUsers: ", error.message);
        res.status(500).json({ error: 'Failed to retrieve network users' });
    }
};

module.exports = { getUsersForSidebar, getNetworkUsers };
