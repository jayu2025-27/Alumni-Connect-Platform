const { Job } = require("../Models/db");
const { sendNotificationEmail } = require("../utils/emailService");

// Get all jobs
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll();
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
};

// Create a new job
const createJob = async (req, res) => {
    try {
        const { title, company, location, description } = req.body;

        if (!title || !company || !location || !description) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newJob = await Job.create({ title, company, location, description });

        // Trigger Notification Email (Fire and forget)
        const subject = `New Job Opening Created: ${title}`;
        const htmlContent = `
            <h2>New Job Opening Posted</h2>
            <p>A new job opportunity has been posted to Alumni Connect.</p>
            <ul>
                <li><strong>Title:</strong> ${title}</li>
                <li><strong>Company:</strong> ${company}</li>
                <li><strong>Location:</strong> ${location}</li>
            </ul>
            <p><strong>Description:</strong></p>
            <p>${description}</p>
            <hr />
            <p><small>This is an automated notification from Alumni Connect.</small></p>
        `;
        sendNotificationEmail(subject, htmlContent);

        res.status(201).json(newJob);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create job" });
    }
};

module.exports = {
    getJobs,
    createJob,
};
