
const { Mentorship } = require("../Models/db");

// Get all mentorships
const getMentorships = async (req, res) => {
    try {
        const mentorships = await Mentorship.findAll();
        res.json(mentorships);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch mentorships" });
    }
};

// Create a new mentorship
const createMentorship = async (req, res) => {
    try {
        const { title, description, date, time } = req.body;

        if (!title || !description || !date || !time) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newMentorship = await Mentorship.create({ title, description, date, time });
        res.status(201).json(newMentorship);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create mentorship" });
    }
};

module.exports = {
    getMentorships,
    createMentorship,
};
