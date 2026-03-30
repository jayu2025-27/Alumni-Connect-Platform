const { User, Alumni } = require("../Models/db");

const followUser = async (req, res) => {
  const { UserId, followeeId } = req.params;

  try {
    const user = await User.findByPk(UserId);
    const followee = await User.findByPk(followeeId);

    if (!user || !followee) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add followee to user's following list (which automatically updates followee's followers list via the junction table)
    await user.addFollowing(followee);

    res.status(200).json({ message: 'Successfully followed the User' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to follow the User' });
  }
};

const followAlumni = async (req, res) => {
  const { UserId, alumniId } = req.params;

  try {
    const user = await User.findByPk(UserId);
    const alumni = await Alumni.findByPk(alumniId);

    if (!user || !alumni) {
      return res.status(404).json({ error: 'User or Alumni not found' });
    }

    // Add alumni to user's followingAlumni list
    await user.addFollowingAlumni(alumni);

    res.status(200).json({ message: 'Successfully followed the alumni' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to follow the alumni' });
  }
}

const unfollowUser = async (req, res) => {
  const { UserId, followeeId } = req.params;

  try {
    const user = await User.findByPk(UserId);
    const followee = await User.findByPk(followeeId);

    if (!user || !followee) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.removeFollowing(followee);

    res.status(200).json({ message: 'Successfully unfollowed the User' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to unfollow the User' });
  }
}

const unfollowAlumni = async (req, res) => {
  const { UserId, alumniId } = req.params;

  try {
    const user = await User.findByPk(UserId);
    const alumni = await Alumni.findByPk(alumniId);

    if (!user || !alumni) {
      return res.status(404).json({ error: 'User or Alumni not found' });
    }

    await user.removeFollowingAlumni(alumni);

    res.status(200).json({ message: 'Successfully unfollowed the alumni' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to unfollow the alumni' });
  }
}

module.exports = { followUser, followAlumni, unfollowUser, unfollowAlumni };