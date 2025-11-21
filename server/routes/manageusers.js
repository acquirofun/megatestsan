const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get top 500 users sorted by balance
router.get('/users/top', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ balance: -1 })
      .limit(500)
      .select('username telegramId firstName lastName balance miningTotal miningPower taskPoints walletAddress isPremium lastLogin');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching top users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Search users by username or telegramId
router.get('/users/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { telegramId: { $regex: query, $options: 'i' } }
      ]
    })
    .select('username telegramId firstName lastName balance miningTotal miningPower taskPoints walletAddress isPremium lastLogin')
    .limit(50);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching users',
      error: error.message
    });
  }
});

// Get users with wallet addresses
router.get('/users/with-wallets', async (req, res) => {
  try {
    const users = await User.find({
      walletAddress: { $ne: null, $ne: '' }
    })
    .select('username telegramId firstName lastName walletAddress balance isPremium lastLogin')
    .sort({ lastLogin: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users with wallets:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users with wallets',
      error: error.message
    });
  }
});

// Update user balances and stats
router.put('/users/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const { balance, miningTotal, miningPower, taskPoints } = req.body;

    const user = await User.findOneAndUpdate(
      { telegramId },
      {
        $set: {
          balance: Number(balance) || 0,
          miningTotal: Number(miningTotal) || 0,
          miningPower: Number(miningPower) || 0,
          taskPoints: Number(taskPoints) || 0,
          totalBalance: Number(balance) || 0 // Update totalBalance as well
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
});

// Delete user
router.delete('/users/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;

    const user = await User.findOneAndDelete({ telegramId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

module.exports = router;