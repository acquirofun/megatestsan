// routes/tasks.js
const express = require('express');
const router = express.Router();
const vm = require('vm'); // Node.js module to safely API requests
const User = require('../models/User');
const axios = require('axios');



// Add the server time endpoint
router.get('/server-time', (req, res) => {
  res.json({ timestamp: Date.now() });
});

router.post('/claim-spin-points', async (req, res) => {
  try {
    const { telegramId, pointsAward } = req.body;

    // Validate required fields
    if (!telegramId || !pointsAward) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
      $inc: {
        balance: pointsAward,
      },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: updatedUser.balance,
      }
    });

  } catch (error) {
    console.error('Error updating energy', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update energy',
      error: error.message
    });
  }
});


router.post('/update-spin-balance', async (req, res) => {
  try {
    const { telegramId, spinLimit, spinTimeStamp } = req.body;

    // Validate required fields
    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
      $set: {
        spinTimeStamp: spinTimeStamp,
        spinLimit: spinLimit,
      },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        spinLimit: updatedUser.spinLimit,
      }
    });

  } catch (error) {
    console.error('Error updating energy', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update energy',
      error: error.message
    });
  }
});


// In your backend API route handler for update-spin-balance-ads
router.post('/update-spin-balance-ads', async (req, res) => {
  try {
    const { telegramId, spinLimit, watchCountSpin, lastAdWatchSpin } = req.body;

    // Update user document with new spin balance and ad watch data
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
        $inc: { spinLimit: spinLimit || 0 },
        $set: {
          watchCountSpin: watchCountSpin,
          lastAdWatchSpin: lastAdWatchSpin
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Spin balance and ad watch data updated successfully',
      data: {
        spinLimit: updatedUser.spinLimit,
        watchCountSpin: updatedUser.watchCountSpin,
        lastAdWatchSpin: updatedUser.lastAdWatchSpin
      }
    });
  } catch (error) {
    console.error('Error updating spin balance:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating spin balance'
    });
  }
});

// In your backend API route handler for update-spin-balance-ads
router.post('/update-ad-watch', async (req, res) => {
  try {
    const { telegramId, watchCountTask, adTimeStamp, adLimit, lastAdWatchTask, pointsAward } = req.body;

    // Update user document with new spin balance and ad watch data
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
        $inc: { 
          balance: pointsAward
         },
        $set: {
          watchCountTask: watchCountTask,
          lastAdWatchTask: lastAdWatchTask,
          adTimeStamp: adTimeStamp,
          adLimit: adLimit
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Spin balance and ad watch data updated successfully',
      data: {
        balance: updatedUser.balance,
        adLimit: updatedUser.adLimit,
        watchCountTask: updatedUser.watchCountTask,
        lastAdWatchTask: updatedUser.lastAdWatchTask,
        adTimeStamp: updatedUser.adTimeStamp
      }
    });
  } catch (error) {
    console.error('Error updating spin balance:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating spin balance'
    });
  }
});


router.post('/update-spin-balance-new', async (req, res) => {
  try {
    const { telegramId, spinLimit, watchCountSpin, spinTimeStamp } = req.body;

    // Validate required fields
    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
      $set: {
        spinTimeStamp: spinTimeStamp,
        spinLimit: spinLimit,
        watchCountSpin: watchCountSpin
      }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        spinLimit: updatedUser.spinLimit,
        watchCountSpin: updatedUser.watchCountSpin
      }
    });

  } catch (error) {
    console.error('Error updating energy', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update energy',
      error: error.message
    });
  }
});



router.post('/update-ad-balance-new', async (req, res) => {
  try {
    const { telegramId, adLimit, watchCountTask, adTimeStamp } = req.body;

    // Validate required fields
    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
      $set: {
        adTimeStamp: adTimeStamp,
        adLimit: adLimit,
        watchCountTask: watchCountTask
      }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        adLimit: updatedUser.adLimit,
        watchCountTask: updatedUser.watchCountTask
      }
    });

  } catch (error) {
    console.error('Error updating energy', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update energy',
      error: error.message
    });
  }
});


// Route to claim task
router.post('/claim-task', async (req, res) => {
  try {
    const { telegramId, taskId, bonusAmount } = req.body;

    // Validate required fields
    if (!telegramId || !taskId || bonusAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
        $inc: {
          balance: bonusAmount,
          taskPoints: bonusAmount
        },
        $push: {
          tasksCompleted: {
            taskId
          }
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: updatedUser.balance,
        taskPoints: updatedUser.taskPoints,
        tasksCompleted: updatedUser.tasksCompleted
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

// Route to save manual task
router.post('/save-manual-task', async (req, res) => {
    try {
      const { telegramId, manualTasksCompleted } = req.body;
  
      // Validate required fields
      if (!telegramId || !manualTasksCompleted) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }
  
      // First check if the task already exists
      const existingUser = await User.findOne({
        telegramId,
        'manualTasksCompleted.taskId': manualTasksCompleted.taskId
      });
  
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Task already exists for this user'
        });
      }
  
      // Find and update user
      const updatedUser = await User.findOneAndUpdate(
        { telegramId },
        {
          $push: {
            manualTasksCompleted: manualTasksCompleted
          }
        },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      res.status(200).json({
        success: true,
        data: {
          manualTasksCompleted: updatedUser.manualTasksCompleted
        }
      });
    } catch (error) {
      console.error('Error saving manual task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save manual task',
        error: error.message
      });
    }
  });


  // Route to claim manual task
router.post('/claim-manual-task', async (req, res) => {
  try {
    const { telegramId, bonusAmount, manualTasksCompleted } = req.body;

    // Validate required fields
    if (!telegramId || !manualTasksCompleted || !manualTasksCompleted.taskId || bonusAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update specific task within manualTasksCompleted array
    const updatedUser = await User.findOneAndUpdate(
      { telegramId, "manualTasksCompleted.taskId": manualTasksCompleted.taskId },
      {
        $inc: {
          balance: bonusAmount,
          taskPoints: bonusAmount
        },
        $set: {
          "manualTasksCompleted.$.completed": true  // Update the 'completed' field for the specific taskId
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User or task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: updatedUser.balance,
        taskPoints: updatedUser.taskPoints,
        manualTasksCompleted: updatedUser.manualTasksCompleted
      }
    });

  } catch (error) {
    console.error('Error claiming manual task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to claim manual task',
      error: error.message
    });
  }
});



// Route to save adverts task
router.post('/save-advert-task', async (req, res) => {
    try {
      const { telegramId, advertTasksCompleted } = req.body;
  
      // Validate required fields
      if (!telegramId || !advertTasksCompleted) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }
  
      // First check if the task already exists
      const existingUser = await User.findOne({
        telegramId,
        'advertTasksCompleted.taskId': advertTasksCompleted.taskId
      });
  
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Task already exists for this user'
        });
      }
  
      // Find and update user
      const updatedUser = await User.findOneAndUpdate(
        { telegramId },
        {
          $push: {
            advertTasksCompleted: advertTasksCompleted
          }
        },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      res.status(200).json({
        success: true,
        data: {
          advertTasksCompleted: updatedUser.advertTasksCompleted
        }
      });
    } catch (error) {
      console.error('Error saving manual task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save manual task',
        error: error.message
      });
    }
  });


  // Route to claim manual task
router.post('/claim-advert-task', async (req, res) => {
  try {
    const { telegramId, bonusAmount, advertTasksCompleted } = req.body;

    // Validate required fields
    if (!telegramId || !advertTasksCompleted || !advertTasksCompleted.taskId || bonusAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update specific task within manualTasksCompleted array
    const updatedUser = await User.findOneAndUpdate(
      { telegramId, "advertTasksCompleted.taskId": advertTasksCompleted.taskId },
      {
        $inc: {
          balance: bonusAmount,
          taskPoints: bonusAmount
        },
        $set: {
          "advertTasksCompleted.$.completed": true  // Update the 'completed' field for the specific taskId
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User or task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: updatedUser.balance,
        taskPoints: updatedUser.taskPoints,
        advertTasksCompleted: updatedUser.advertTasksCompleted
      }
    });

  } catch (error) {
    console.error('Error claiming manual task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to claim manual task',
      error: error.message
    });
  }
});

// Route to save adverts task
router.post('/save-youtube-task', async (req, res) => {
    try {
      const { telegramId, youtubeTasksCompleted } = req.body;
  
      // Validate required fields
      if (!telegramId || !youtubeTasksCompleted) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }
  
      // First check if the task already exists
      const existingUser = await User.findOne({
        telegramId,
        'youtubeTasksCompleted.taskId': youtubeTasksCompleted.taskId
      });
  
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Task already exists for this user'
        });
      }
  
      // Find and update user
      const updatedUser = await User.findOneAndUpdate(
        { telegramId },
        {
          $push: {
            youtubeTasksCompleted: youtubeTasksCompleted
          }
        },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      res.status(200).json({
        success: true,
        data: {
          youtubeTasksCompleted: updatedUser.youtubeTasksCompleted
        }
      });
    } catch (error) {
      console.error('Error saving youtube task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save youtube task',
        error: error.message
      });
    }
  });


  // Route to claim manual task
router.post('/claim-youtube-task', async (req, res) => {
  try {
    const { telegramId, bonusAmount, youtubeTasksCompleted } = req.body;

    // Validate required fields
    if (!telegramId || !youtubeTasksCompleted || !youtubeTasksCompleted.taskId || bonusAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update specific task within manualTasksCompleted array
    const updatedUser = await User.findOneAndUpdate(
      { telegramId, "youtubeTasksCompleted.taskId": youtubeTasksCompleted.taskId },
      {
        $inc: {
          balance: bonusAmount,
          taskPoints: bonusAmount
        },
        $set: {
          "youtubeTasksCompleted.$.completed": true  // Update the 'completed' field for the specific taskId
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User or task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: updatedUser.balance,
        taskPoints: updatedUser.taskPoints,
        youtubeTasksCompleted: updatedUser.youtubeTasksCompleted
      }
    });

  } catch (error) {
    console.error('Error claiming youtube task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to claim youtube task',
      error: error.message
    });
  }
});


// Route to claim referral task
router.post('/claim-referral-task', async (req, res) => {
  try {
    const { telegramId, claimedReferralRewards, bonusAmount } = req.body;

    // Validate required fields
    if (!telegramId || !Array.isArray(claimedReferralRewards) || bonusAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing or invalid required fields'
      });
    }

    // Get the new reward title (the last item in the array)
    const newRewardTitle = claimedReferralRewards[claimedReferralRewards.length - 1];

    // Find user first to check if reward was already claimed
    const user = await User.findOne({ telegramId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if reward was already claimed
    if (user.claimedReferralRewards.includes(newRewardTitle)) {
      return res.status(400).json({
        success: false,
        message: 'Reward already claimed'
      });
    }

    // Update user with new reward and bonus
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
        $inc: {
          balance: bonusAmount,
          taskPoints: bonusAmount
        },
        $addToSet: { // Using $addToSet instead of $push to prevent duplicates
          claimedReferralRewards: newRewardTitle
        }
      },
      { 
        new: true,
        runValidators: true // This ensures mongoose validation runs on update
      }
    );

    res.status(200).json({
      success: true,
      data: {
        balance: updatedUser.balance,
        taskPoints: updatedUser.taskPoints,
        claimedReferralRewards: updatedUser.claimedReferralRewards
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


// Route to claim ton task
router.post('/claim-ton-task', async (req, res) => {
  try {
    const { telegramId, tonTasks, tonTransact, bonusAmount } = req.body;

    // Validate required fields
    if (!telegramId || !tonTasks || bonusAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
        $inc: {
          balance: bonusAmount,
          taskPoints: bonusAmount,
          tonTransactions: tonTransact,
        },
        $set: {
          tonTasks: tonTasks || true
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: updatedUser.balance,
        taskPoints: updatedUser.taskPoints,
        tonTasks: updatedUser.tonTasks,
        tonTransactions: updatedUser.tonTransactions
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


// Route to claim farming points
router.post('/claim-farming', async (req, res) => {
  try {
    const { telegramId, miningTotal, bonusAmount } = req.body;

    // Validate required fields
    if (!telegramId || !miningTotal || bonusAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
        $inc: {
          balance: bonusAmount,
          miningTotal: miningTotal,
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: updatedUser.balance,
        miningTotal: updatedUser.miningTotal,
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


// Route to claim farming points
router.post('/claim-farming-boost', async (req, res) => {
  try {
    const { telegramId, miningPower, tonTransactions } = req.body;

    // Validate required fields
    if (!telegramId || !miningPower || !tonTransactions ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
        $inc: {
          tonTransactions: tonTransactions

        },
        $set: {
          miningPower: miningPower,
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        miningPower: updatedUser.miningPower,
        tonTransactions: updatedUser.tonTransactions
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


// Route to claim ranking boost points
router.post('/claim-rank-boost', async (req, res) => {
  try {
    const { telegramId, tonTransactions, balance } = req.body;

    // Validate required fields
    if (!telegramId || !tonTransactions || !balance ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
        $inc: {
          balance: balance,
          tonTransactions: tonTransactions

        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: updatedUser.balance,
        tonTransactions: updatedUser.tonTransactions
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

// Route to select exchange
router.post('/select-exchange', async (req, res) => {
  try {
    const { telegramId, selectedExchange } = req.body;

    // Validate required fields
    if (!telegramId || !selectedExchange ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
        $set: {

            selectedExchange: selectedExchange

        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {

        selectedExchange: updatedUser.selectedExchange
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


// Route to save wallet address
router.post('/save-wallet-address', async (req, res) => {
  try {
    const { telegramId, walletAddress, isAddressSaved } = req.body;

    // Validate required fields
    if (!telegramId || !isAddressSaved || !walletAddress ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
        $set: {

            walletAddress: walletAddress,
            isAddressSaved: isAddressSaved

        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {

        walletAddress: updatedUser.walletAddress,
        isAddressSaved: updatedUser.isAddressSaved
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

// Route to save wallet address
router.post('/disconnect-wallet-address', async (req, res) => {
  try {
    const { telegramId, isAddressSaved } = req.body;

    // Validate required fields
    if (!telegramId || isAddressSaved ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
        $set: {

          walletAddress: "",
          isAddressSaved: isAddressSaved
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {

        walletAddress: updatedUser.walletAddress,
        isAddressSaved: updatedUser.isAddressSaved
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




// Route to save wallet address
router.post('/claim-last-daily-checkin', async (req, res) => {
  try {
    const { telegramId, lastCheckIn, checkInDays, balance } = req.body;

    // Validate required fields
    if (!telegramId || !lastCheckIn ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
        $inc: {
          balance: balance
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
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: updatedUser.balance,
        lastCheckIn: updatedUser.lastCheckIn,
        checkInDays: updatedUser.checkInDays
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


// Route to claim daily checkin
router.post('/claim-daily-checkin', async (req, res) => {
  try {
    const { telegramId, lastCheckIn, checkInDays, balance, checkinRewards } = req.body;

    const newCheckinDays = checkInDays[checkInDays.length - 1];

    // Validate required fields
    if (!telegramId || !lastCheckIn ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
        $inc: {
          balance: balance,
          checkinRewards: checkinRewards
        },
        $set: {
          lastCheckIn: lastCheckIn
        },
        $addToSet: {
          checkInDays: newCheckinDays
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: updatedUser.balance,
        lastCheckIn: updatedUser.lastCheckIn,
        checkInDays: updatedUser.checkInDays,
        checkinRewards: updatedUser.checkinRewards
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


// Route to claim start over rewards
router.post('/claim-daily-checkin-startover', async (req, res) => {
  try {
    const { telegramId, lastCheckIn, checkInDays, balance, checkinRewards } = req.body;

    // Validate required fields
    if (!telegramId || !lastCheckIn ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { telegramId },
      {
        $inc: {
          balance: balance,
          checkinRewards: checkinRewards
        },
        $set: {
          lastCheckIn: lastCheckIn,
          checkInDays: checkInDays
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balance: updatedUser.balance,
        lastCheckIn: updatedUser.lastCheckIn,
        checkInDays: updatedUser.checkInDays,
        checkinRewards: updatedUser.checkinRewards
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



// Route to check Telegram membership
router.get('/checkTelegramMembership', async (req, res) => {
  const { chatId, userId } = req.query;

  // Validate required parameters
  if (!chatId || !userId) {
      return res.status(400).json({ 
          error: 'Missing required parameters: chatId and userId are required' 
      });
  }

  const telegramBotToken = process.env.BOT_TOKEN;

  // Validate bot token
  if (!telegramBotToken) {
      return res.status(500).json({ 
          error: 'Bot token not configured' 
      });
  }

  try {
      const response = await axios.get(`https://api.telegram.org/bot${telegramBotToken}/getChatMember`, {
          params: {
              chat_id: chatId,
              user_id: userId
          }
      });

      if (response.data.ok && ['member', 'administrator', 'creator'].includes(response.data.result.status)) {
          res.status(200).json({ verified: true });
      } else {
          res.status(400).json({ verified: false });
      }
  } catch (error) {
      console.error('Error verifying Telegram membership:', error.response?.data || error.message);
      res.status(500).json({ 
          error: 'Internal Server Error',
          message: error.response?.data?.description || 'Failed to verify membership'
      });
  }
});



// Utility functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Telegram rate limit constants
const MESSAGES_PER_SECOND = 30; // Telegram allows ~30 messages per second
const MINIMUM_DELAY = 1000 / MESSAGES_PER_SECOND; // Minimum delay between messages
const SAFETY_FACTOR = 1.2; // Add 20% extra delay for safety
const DELAY_BETWEEN_MESSAGES = MINIMUM_DELAY * SAFETY_FACTOR;

async function sendMessageToUser(botToken, userId, message, options = {}) {
  const { webAppUrl, buttonTitle, includeButtons } = options;
  
  try {
    const messageData = {
      chat_id: userId,
      text: message,
      parse_mode: 'HTML'
    };

    // Only add buttons if includeButtons is true and webAppUrl is provided
    if (includeButtons && webAppUrl && buttonTitle) {
      messageData.reply_markup = {
        inline_keyboard: [
          [{ text: `${buttonTitle}`, web_app: { url: webAppUrl } }],
        ]
      };
    }

    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, messageData);
    return { success: true, userId };
  } catch (error) {
    if (error.response?.data?.error_code === 429) {
      // Handle rate limiting error
      const retryAfter = error.response.data.parameters?.retry_after || 5;
      await sleep(retryAfter * 1000);
      // Retry the message
      return sendMessageToUser(botToken, userId, message, options);
    } else if (error.response?.data?.error_code === 403) {
      return { success: false, userId, error: 'User has blocked the bot or never started it' };
    }
    return { success: false, userId, error: error.message };
  }
}

async function sendBulkMessages(message, options = {}) {
  const { webAppUrl, buttonTitle, includeButtons, batchSize = 25 } = options;
  const botToken = process.env.BOT_TOKEN;
  
  if (!botToken) {
    throw new Error('Bot token not configured');
  }

  let successCount = 0;
  let failureCount = 0;
  const failures = [];

  try {
    const totalUsers = await User.countDocuments();
    console.log(`Starting bulk message send to ${totalUsers} users`);
    
    // Process users in batches
    for (let skip = 0; skip < totalUsers; skip += batchSize) {
      const users = await User.find({}, 'telegramId')
        .skip(skip)
        .limit(batchSize);

      // Process each batch with controlled timing
      for (const user of users) {
        const result = await sendMessageToUser(botToken, user.telegramId, message, {
          webAppUrl,
          buttonTitle,
          includeButtons
        });

        if (result.success) {
          successCount++;
        } else {
          failureCount++;
          failures.push({
            telegramId: result.userId,
            error: result.error
          });
        }

        // Apply rate limiting delay
        await sleep(DELAY_BETWEEN_MESSAGES);
      }

      console.log(`Processed ${skip + users.length} out of ${totalUsers} users`);
      
      // Add extra delay between batches for safety
      await sleep(1000);
    }

    return {
      totalUsers,
      successCount,
      failureCount,
      failures,
      estimatedTimeSeconds: Math.ceil((totalUsers * DELAY_BETWEEN_MESSAGES) / 1000)
    };
  } catch (error) {
    console.error('Bulk message sending failed:', error);
    throw error;
  }
}

// Routes
router.post('/sendBulkMessage', async (req, res) => {
  const { message, webAppUrl, buttonTitle, includeButtons = false } = req.body;
  
  if (!message) {
    return res.status(400).json({
      error: 'Message is required'
    });
  }

  if (includeButtons && !webAppUrl && !buttonTitle) {
    return res.status(400).json({
      error: 'Web App URL and Button Title is required when including buttons'
    });
  }

  try {
    const result = await sendBulkMessages(message, {
      webAppUrl,
      buttonTitle,
      includeButtons,
      batchSize: 25
    });
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// Utility function to check if bot can message user
async function canBotMessageUser(botToken, userId) {
  try {
    // Try to get chat member status
    const response = await axios.get(`https://api.telegram.org/bot${botToken}/getChatMember`, {
      params: {
        chat_id: userId,
        user_id: userId  // For private chats, both are the same
      }
    });

    // Check if the user has blocked or deleted the bot
    const status = response.data?.result?.status;
    return status && !['kicked', 'left'].includes(status);
  } catch (error) {
    // If we get a 403 error, the bot is blocked/kicked
    if (error.response?.data?.error_code === 403) {
      return false;
    }
    // For other errors, we'll assume we can't message to be safe
    console.error('Error checking message permission:', error);
    return false;
  }
}




module.exports = router;