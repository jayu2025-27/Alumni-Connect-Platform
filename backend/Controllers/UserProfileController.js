const { User } = require('../Models/db');

// Get user profile
const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ['fullName', 'graduationYear', 'course', 'usn', 'fieldOfStudy'] // Select specific fields
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const [updatedRows] = await User.update(updates, {
      where: { id: id }
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = await User.findByPk(id);
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
