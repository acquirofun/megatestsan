// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

const REFERRAL_BONUS = 10000;
const VALID_METRICS = ['balance', 'miningTotal'];

const DEFAULT_USER_VALUES = {
  selectedExchange: {
    id: 'selectex',
    icon: '/exchange.svg',
    name: 'Choose exchange'
  },
  tonTransactions: 0,
  taskPoints: 0,
  lastCheckIn: null,
  checkInDays: [],
  checkinRewards: 0,
  miningPower: 400,
  walletAddress: '',
  isAddressSaved: false,
  premiumReward: 0,
  yearsReward: 0,
  totalBalance: 0,
  tonTasks: false,
  miningTotal: 0,
  claimedReferralRewards: [],
  tasksCompleted: [],
  manualTasksCompleted: [],
  advertTasksCompleted: [],
  youtubeTasksCompleted: [],
  balance: 0,
  refBonus: 0,  // Added refBonus to default values
  spinLimit: 1,
  watchCountSpin: 1,
  lastAdWatchSpin: null,
  spinTimeStamp: null,
  watchCountTask: 1,
  lastAdWatchTask: null,
  adLimit: 5,
  adTimeStamp: null,
};

// Route to handle Telegram user authentication
router.post('/telegram/auth', async (req, res) => {
  try {
    const { telegramId, firstName, lastName, username, isPremium, referrer_id } = req.body;

    if (!telegramId || !firstName) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Check if user exists first
    let user = await User.findOne({ telegramId });
    let finalReferrerId = null;

    // Only process referral for new users
    if (!user && referrer_id) {
      const referrer = await User.findOne({ telegramId: referrer_id });
      
      if (referrer && referrer_id !== telegramId) {
        finalReferrerId = referrer_id;

        // Update referrer in a single operation
        await User.findOneAndUpdate(
          { 
            telegramId: referrer_id,
            'referrals.telegramId': { $ne: telegramId } // Prevent duplicate referrals
          },
          {
            $push: {
              referrals: {
                telegramId,
                username: username || '',
                joinedAt: new Date()
              }
            },
            $inc: {
              balance: REFERRAL_BONUS,
              totalBalance: REFERRAL_BONUS,
              refBonus: REFERRAL_BONUS
            }
          }
        );
      }
    }

    // Create or update user
    user = await User.findOneAndUpdate(
      { telegramId },
      {
        $setOnInsert: {
          telegramId,
          isPremium,
          referrer_id: finalReferrerId,
          referrals: [],
          ...DEFAULT_USER_VALUES
        },
        $set: {
          firstName,
          lastName,
          username,
          lastLogin: new Date()
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    // Get referrer's info if it exists
    let referrer = null;
    if (user.referrer_id) {
      referrer = await User.findOne({ telegramId: user.referrer_id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        telegramId: user.telegramId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        tasksCompleted: user.tasksCompleted,
        manualTasksCompleted: user.manualTasksCompleted,
        advertTasksCompleted: user.advertTasksCompleted,
        youtubeTasksCompleted: user.youtubeTasksCompleted,
        isPremium: user.isPremium,
        spinLimit: user.spinLimit,
        watchCountSpin: user.watchCountSpin,
        lastAdWatchSpin: user.lastAdWatchSpin,
        spinTimeStamp: user.spinTimeStamp,
        watchCountTask: user.watchCountTask,
        lastAdWatchTask: user.lastAdWatchTask,
        adLimit: user.adLimit,
        adTimeStamp: user.adTimeStamp,

        referrer_id: user.referrer_id,
        walletAddress: user.walletAddress,
        isAddressSaved: user.isAddressSaved,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        selectedExchange: user.selectedExchange,
        tonTransactions: user.tonTransactions,
        tonTasks: user.tonTasks,
        taskPoints: user.taskPoints,
        lastCheckIn: user.lastCheckIn,
        checkInDays: user.checkInDays,
        checkinRewards: user.checkinRewards,
        claimedReferralRewards: user.claimedReferralRewards,
        miningPower: user.miningPower,
        premiumReward: user.premiumReward,
        yearsReward: user.yearsReward,
        totalBalance: user.totalBalance,
        miningTotal: user.miningTotal,
        balance: user.balance,
        refBonus: user.refBonus // Added refBonus to response
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
});

// Route to get user data
router.get('/telegram/user/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        telegramId: user.telegramId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        tasksCompleted: user.tasksCompleted,
        manualTasksCompleted: user.manualTasksCompleted,
        advertTasksCompleted: user.advertTasksCompleted,
        youtubeTasksCompleted: user.youtubeTasksCompleted,
        isPremium: user.isPremium,
        spinLimit: user.spinLimit,
        watchCountSpin: user.watchCountSpin,
        lastAdWatchSpin: user.lastAdWatchSpin,
        spinTimeStamp: user.spinTimeStamp,
        watchCountTask: user.watchCountTask,
        lastAdWatchTask: user.lastAdWatchTask,
        adLimit: user.adLimit,
        adTimeStamp: user.adTimeStamp,

        referrer_id: user.referrer_id,
        walletAddress: user.walletAddress,
        isAddressSaved: user.isAddressSaved,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        selectedExchange: user.selectedExchange,
        tonTransactions: user.tonTransactions,
        tonTasks: user.tonTasks,
        taskPoints: user.taskPoints,
        lastCheckIn: user.lastCheckIn,
        checkInDays: user.checkInDays,
        checkinRewards: user.checkinRewards,
        claimedReferralRewards: user.claimedReferralRewards,
        miningPower: user.miningPower,
        premiumReward: user.premiumReward,
        yearsReward: user.yearsReward,
        totalBalance: user.totalBalance,
        miningTotal: user.miningTotal,
        balance: user.balance,
        refBonus: user.refBonus // Added refBonus to response
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
});

// Route to get user's referrals with their current balances
router.get('/user/referrals/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get current data for all referrals
    const referralsWithBalances = await Promise.all(
      user.referrals.map(async (referral) => {
        const referredUser = await User.findOne({ 
          telegramId: referral.telegramId 
        });
        
        return {
          telegramId: referral.telegramId,
          username: referredUser?.username || referral.username,
          balance: referredUser?.balance || 0,
          joinedAt: referral.joinedAt
        };
      })
    );

    res.status(200).json({
      success: true,
      referrals: referralsWithBalances
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching referrals',
      error: error.message
    });
  }
});





// Simplified leaderboard route with metric parameter
router.get('/leaderboard/:metric?', async (req, res) => {
  try {
    const metric = req.params.metric || 'balance';

    if (!VALID_METRICS.includes(metric)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid metric specified'
      });
    }

    const topUsers = await User.find(
      {}, 
      {
        username: 1,
        firstName: 1,
        lastName: 1,
        balance: 1,
        miningTotal: 1,
        telegramId: 1
      }
    )
    .sort({ [metric]: -1 })
    .limit(100);

    const leaderboardData = topUsers.map((user, index) => ({
      rank: index + 1,
      username: user.username || `User${user.telegramId.substr(-4)}`,
      balance: user.balance,
      miningTotal: user.miningTotal,
      firstName: user.firstName,
      lastName: user.lastName
    }));

    res.status(200).json({
      success: true,
      metric,
      leaderboard: leaderboardData,
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard data',
      error: error.message
    });
  }
});

// Simplified user position route
router.get('/leaderboard/position/:telegramId/:metric?', async (req, res) => {
  try {
    const { telegramId } = req.params;
    const metric = req.params.metric || 'balance';

    if (!VALID_METRICS.includes(metric)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid metric specified'
      });
    }

    const allUsers = await User.find(
      {}, 
      {
        username: 1,
        [metric]: 1,
        telegramId: 1
      }
    ).sort({ [metric]: -1 });

    const userIndex = allUsers.findIndex(user => user.telegramId === telegramId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get nearby users (2 above and 2 below)
    const start = Math.max(0, userIndex - 2);
    const end = Math.min(allUsers.length, userIndex + 3);
    const nearbyUsers = allUsers.slice(start, end).map((user, index) => ({
      rank: start + index + 1,
      username: user.username || `User${user.telegramId.substr(-4)}`,
      [metric]: user[metric],
      isCurrentUser: user.telegramId === telegramId
    }));

    res.status(200).json({
      success: true,
      userRank: userIndex + 1,
      totalUsers: allUsers.length,
      nearbyUsers
    });

  } catch (error) {
    console.error('Position fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user position',
      error: error.message
    });
  }
});


router.post('/new-premium-user-bonus', async (req, res) => {
  try {
    const { telegramId, lastCheckIn, checkInDays, balance, premiumReward, yearsReward, checkinRewards } = req.body;
    
    // Validate required fields
    if (!telegramId || !lastCheckIn || !checkinRewards) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // First check if user has already received rewards
    const existingUser = await User.findOne({ telegramId });
    if (existingUser && (existingUser.yearsReward > 0 || existingUser.premiumReward > 0)) {
      return res.status(200).json({
        success: true,
        data: {
          balance: existingUser.balance,
          lastCheckIn: existingUser.lastCheckIn,
          checkInDays: existingUser.checkInDays,
          checkinRewards: existingUser.checkinRewards,
          premiumReward: existingUser.premiumReward,
          yearsReward: existingUser.yearsReward
        },
        message: 'Rewards already claimed'
      });
    }

    // If no rewards yet, update user
    const updatedUser = await User.findOneAndUpdate(
      { 
        telegramId,
        yearsReward: 0, // Only update if rewards haven't been given
        premiumReward: 0
      },
      {
        $inc: {
          balance: balance,
          checkinRewards: checkinRewards,
          premiumReward: premiumReward,
          yearsReward: yearsReward
        },
        $set: {
          lastCheckIn: lastCheckIn,
          checkInDays: checkInDays
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found or rewards already claimed'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: updatedUser.balance,
        lastCheckIn: updatedUser.lastCheckIn,
        checkInDays: updatedUser.checkInDays,
        checkinRewards: updatedUser.checkinRewards,
        premiumReward: updatedUser.premiumReward,
        yearsReward: updatedUser.yearsReward
      }
    });
  } catch (error) {
    console.error('Error claiming task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to claim task',
      error: error.message
    });
  }
});

router.post('/new-user-bonus', async (req, res) => {
  try {
    const { telegramId, lastCheckIn, checkInDays, balance, yearsReward, checkinRewards } = req.body;
    
    // Validate required fields
    if (!telegramId || !lastCheckIn || !checkinRewards) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // First check if user has already received rewards
    const existingUser = await User.findOne({ telegramId });
    if (existingUser && existingUser.yearsReward > 0) {
      return res.status(200).json({
        success: true,
        data: {
          balance: existingUser.balance,
          lastCheckIn: existingUser.lastCheckIn,
          checkInDays: existingUser.checkInDays,
          checkinRewards: existingUser.checkinRewards,
          yearsReward: existingUser.yearsReward
        },
        message: 'Rewards already claimed'
      });
    }

    // If no rewards yet, update user
    const updatedUser = await User.findOneAndUpdate(
      { 
        telegramId,
        yearsReward: 0 // Only update if rewards haven't been given
      },
      {
        $inc: {
          balance: balance,
          checkinRewards: checkinRewards,
          yearsReward: yearsReward
        },
        $set: {
          lastCheckIn: lastCheckIn,
          checkInDays: checkInDays
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found or rewards already claimed'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: updatedUser.balance,
        lastCheckIn: updatedUser.lastCheckIn,
        checkInDays: updatedUser.checkInDays,
        checkinRewards: updatedUser.checkinRewards,
        yearsReward: updatedUser.yearsReward
      }
    });
  } catch (error) {
    console.error('Error claiming task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to claim task',
      error: error.message
    });
  }
});


// Route to get overall user statistics
router.get('/statistics', async (req, res) => {
  try {
    // Get current timestamp and 24 hours ago timestamp
    const currentTime = new Date();
    const last24Hours = new Date(currentTime - 24 * 60 * 60 * 1000);
    const lastFiveMinutes = new Date(currentTime - 5 * 60 * 1000); // Consider users active in last 5 minutes as current online

    // Aggregate pipeline to get all statistics in one query
    const stats = await User.aggregate([
      {
        $facet: {
          // Total number of users
          'totalUsers': [
            {
              $count: 'count'
            }
          ],
          // Sum of all user balances
          'totalBalance': [
            {
              $group: {
                _id: null,
                total: { $sum: '$balance' }
              }
            }
          ],
          // Count of users who logged in within last 24 hours
          'onlineLast24Hours': [
            {
              $match: {
                lastLogin: { $gte: last24Hours }
              }
            },
            {
              $count: 'count'
            }
          ],
          // Count of users who logged in within last 5 minutes (currently online)
          'currentlyOnline': [
            {
              $match: {
                lastLogin: { $gte: lastFiveMinutes }
              }
            },
            {
              $count: 'count'
            }
          ]
        }
      }
    ]);

    // Format the response
    const formattedStats = {
      success: true,
      statistics: {
        totalUsers: stats[0].totalUsers[0]?.count || 0,
        totalBalance: stats[0].totalBalance[0]?.total || 0,
        onlineLast24Hours: stats[0].onlineLast24Hours[0]?.count || 0,
        currentlyOnline: stats[0].currentlyOnline[0]?.count || 0,
        lastUpdated: currentTime
      }
    };

    res.status(200).json(formattedStats);

  } catch (error) {
    console.error('Statistics fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});



module.exports = router;