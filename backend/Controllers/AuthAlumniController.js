const { Alumni } = require('../Models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Signup Function
const signupAlumni = async (req, res) => {
    try {
        const { fullName, collegeEmail, password, confirmPassword, graduationYear, linkedin, degreeCertificate } = req.body;
        const profilePhoto = req.file;

        console.log({ fullName, collegeEmail, password, confirmPassword, graduationYear, linkedin, degreeCertificate }, profilePhoto);

        const existingAlumni = await Alumni.findOne({ where: { collegeEmail } });
        if (existingAlumni) {
            return res.status(409).json({
                message: 'Alumni already exists, you can log in',
                success: false
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                success: false
            });
        }

        let profilePhotoURL = '';
        if (profilePhoto) {
            const photoUpload = await cloudinary.uploader.upload(profilePhoto.path, { resource_type: 'image' });
            profilePhotoURL = photoUpload.secure_url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const alumni = await Alumni.create({
            fullName,
            collegeEmail,
            password: hashedPassword,
            graduationYear,
            linkedin,
            profilePhoto: profilePhotoURL,
            degreeCertificate, // Assuming this is also a URL or string passed in body? The original code didn't upload it? Ah, original code had: degreeCertificate as a field in body.
            verified: false,
            role: 'alumni'
        });

        res.status(201).json({
            message: "Signup successful, awaiting verification",
            _id: alumni.id,
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

// Login Function
const loginAlumni = async (req, res) => {
    try {
        const { collegeEmail, password } = req.body;

        const alumni = await Alumni.findOne({ where: { collegeEmail } });
        if (!alumni) {
            return res.status(400).json({
                message: 'Invalid email or password',
                success: false
            });
        }

        const validPassword = await bcrypt.compare(password, alumni.password);
        if (!validPassword) {
            return res.status(400).json({
                message: 'Invalid email or password',
                success: false
            });
        }

        if (!alumni.verified) {
            return res.status(403).json({
                message: 'Account not verified. Please ask Admin to verify your account.',
                success: false
            });
        }

        const token = jwt.sign({ userId: alumni.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            success: true,
            fullname: alumni.fullName,
            token,
            profilePhoto: alumni.profilePhoto,
            _id: alumni.id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = { signupAlumni, loginAlumni };
