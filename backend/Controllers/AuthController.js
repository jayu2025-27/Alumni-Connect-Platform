const { User } = require('../Models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

const signup = async (req, res) => {
    try {
        const { fullName, collegeEmail, password, confirmPassword, graduationYear, course, fieldOfStudy, github, linkedin, usn } = req.body;
        const profilePhoto = req.file;
        console.log({ fullName, collegeEmail, password, confirmPassword, graduationYear, course, fieldOfStudy, github, linkedin, usn }, profilePhoto);

        const existingUser = await User.findOne({ where: { collegeEmail } });
        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists, you can log in',
                success: false
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                success: false
            });
        }

        let imageURL = '';
        if (profilePhoto) {
            const result = await cloudinary.uploader.upload(profilePhoto.path, { resource_type: 'image' });
            imageURL = result.secure_url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            collegeEmail,
            password: hashedPassword,
            graduationYear,
            course,
            profilePhoto: imageURL,
            fieldOfStudy,
            github,
            linkedin,
            usn
        });

        res.status(201).json({
            message: "Signup successful",
            _id: newUser.id, // Keeping _id key for frontend compatibility if needed, but value is id
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { collegeEmail, password } = req.body;
        const user = await User.findOne({ where: { collegeEmail } });
        const errorMessage = 'Invalid email or password';

        if (!user) return res.status(400).json({ message: errorMessage, success: false });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: errorMessage, success: false });

        const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.setHeader('Authorization', `Bearer ${jwtToken}`);

        res.status(200).json({
            message: 'Login successful',
            success: true,
            fullname: user.fullName,
            token: jwtToken,
            profilePhoto: user.profilePhoto,
            _id: user.id,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { signup, login };
