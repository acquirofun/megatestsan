// models/Activity.js
const mongoose = require('mongoose');

// Schema for automatic tasks (with chatId)
const taskSchema = new mongoose.Schema({
  bonusAmount: {
    type: Number,
    default: 0
  },
  chatId: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ""
  },
  id: {
    type: Number,
    required: true
  },
  link: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    required: true
  }
});

// Schema for manual tasks (without chatId)
const manualTaskSchema = new mongoose.Schema({
  bonusAmount: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: ""
  },
  id: {
    type: Number,
    required: true
  },
  link: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    required: true
  }
});


// Schema for manual tasks (without chatId)
const advertTaskSchema = new mongoose.Schema({
  bonusAmount: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: ""
  },
  id: {
    type: Number,
    required: true
  },
  link: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    required: true
  }
});

// Schema for youtube tasks
const youtubeTaskSchema = new mongoose.Schema({
  bonusAmount: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: ""
  },
  id: {
    type: Number,
    required: true
  },
  link: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },

});

const activitySchema = new mongoose.Schema({
  tasks: [taskSchema],
  manualTasks: [manualTaskSchema],
  advertTasks: [advertTaskSchema],
  youtubeTasks: [youtubeTaskSchema],
});

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema, 'activities');

module.exports = Activity;