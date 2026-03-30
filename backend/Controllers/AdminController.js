const { Alumni, User } = require('../Models/db');

// Controller to get all alumni (for admin)
const getAllAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findAll(); // Fetch all alumni
    res.status(200).json({ alumni });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch alumni list' });
  }
};

// Controller to verify alumni (by admin)
const verifyAlumni = async (req, res) => {
  try {
    const [updatedRows] = await Alumni.update(
      { verified: true },
      { where: { id: req.params.id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    const alumni = await Alumni.findByPk(req.params.id);
    res.json({ message: 'Alumni verified successfully', alumni });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying alumni' });
  }
};

// Controller to get all students (for admin)
const getAllStudents = async (req, res) => {
  try {
    const students = await User.findAll(); // Fetch all students
    res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch students list' });
  }
};

module.exports = { getAllAlumni, verifyAlumni, getAllStudents };
