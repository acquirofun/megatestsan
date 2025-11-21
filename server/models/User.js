// models/User.js
const mongoose = require('mongoose');
const { type } = require('os');

const selectedExchangeSchema = new mongoose.Schema({
  id: {
    type: String,
    default: 'selectex'
  },
  icon: {
    type: String,
    default: '/exchange.svg'
  },
  name: {
    type: String,
    default: 'Choose exchange'
  }
});

// Schema for users who were referred by this user
const referralSchema = new mongoose.Schema({
    telegramId: {
      type: String,
      required: true
    },
    username: {
      type: String,
      default: ''
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  });

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  username: {
    type: String
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  walletAddress: {
    type: String,
  },
  isAddressSaved: {
    type: Boolean,
    default: false
  },
  referrer_id: {
    type: String,
    default: null
  },
  referrals: [referralSchema],
  refBonus: {  // New field for referral bonus
    type: Number,
    default: 0
  },
  selectedExchange: {
    type: selectedExchangeSchema,
    default: () => ({})  // This will use the defaults defined above
  },
  tasksCompleted: [{
    taskId: {
      type: Number,
    }
  }],
  manualTasksCompleted: [{
    taskId: {
      type: Number,
    },
    completed: {
        type: Boolean,
        default: false
      }
  }],
  advertTasksCompleted: [{
    taskId: {
      type: Number,
    },
    completed: {
        type: Boolean,
        default: false
      }
  }],
  youtubeTasksCompleted: [{
    taskId: {
      type: Number,
    },
    completed: {
        type: Boolean,
        default: false
      }
  }],
  tonTransactions: {
    type: Number,
    default: 0
  },
  tonTasks: {
    type: Boolean,
    default: false
  },
  taskPoints: {
    type: Number,
    default: 0
  },
  checkInDays: [
    {
    type: Number
    }
  ],
  lastCheckIn: { 
    type: Date,
    get: v => v ? new Date(v) : null
  },
  checkinRewards: {
    type: Number,
    default: 0
  },
  yearsReward: {
    type: Number,
    default: 0
  },
  claimedReferralRewards: [
    {
      type: String
    }
  ],
  miningPower: {
    type: Number,
    default: 400
  },
  premiumReward: {
    type: Number,
    default: 0
  },
  totalBalance: {
    type: Number,
    default: 0
  },
  miningTotal: {
    type: Number,
    default: 0
  },
  spinLimit: {
    type: Number,
    default: 1
  },
  adLimit: {
    type: Number,
    default: 5
  },
  watchCountSpin: {
    type: Number,
    default: 1
  },
  lastAdWatchSpin: Date,
  watchCountTask: {
    type: Number,
    default: 1
  },
  lastAdWatchTask: Date,
  spinTimeStamp: Date,
  adTimeStamp: Date,
  balance: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema, 'telegramUsers');