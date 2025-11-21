// routes/activities.js
const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// Dummy data with corrected structure
const dummyData = {
  tasks: [
    {
      id: 22,
      title: "Join Telegram Channel",
      bonusAmount: 1000,
      icon: "/telegram.svg",
      link: "https://t.me/alphadogsofficial",
      chatId: "-1002373236592"
    },
    {
      id: 2,
      title: "Join Telegram Group",
      bonusAmount: 2000,
      icon: "/telegram.svg",
      link: "https://t.me/alphadogsofficial",
      chatId: "-1002373236592"
    },
  ],
  manualTasks: [
    {
      id: 101,
      title: "Follow our Twitter",
      bonusAmount: 500,
      icon: "/twitter2.svg",
      link: ""
    },
    {
      id: 102,
      title: "Follow our Github",
      bonusAmount: 1000,
      icon: "/twitter.svg",
      link: ""
    },
  ],
  advertTasks: [
    {
      id: 3,
      title: "Follow Our Partners",
      bonusAmount: 500,
      icon: "/telegram.svg",
      link: ""
    },
    {
      id: 4,
      title: "Join Durov Channel",
      bonusAmount: 1000,
      icon: "/twitter2.svg",
      link: ""
    },
  ],
  youtubeTasks: [
    {
      id: 6,
      title: "Watch Alphadogs Intro",
      bonusAmount: 1000,
      icon: "/youtube.svg",
      link: "",
      description: "Watch this video with keen interest",
      thumbnail: "/thumb1.webp"
    },
    {
      id: 7,
      title: "Join Durov Channel",
      bonusAmount: 1000,
      icon: "/youtube.svg",
      link: "",
      description: "Watch this video with keen interest and learn today",
      thumbnail: "/thumb2.webp"
    },
  ],
};

// Route to get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const activities = await Activity.findOne().exec();
    
    if (!activities) {
      return res.status(200).json({
        success: true,
        data: {
          tasks: [],
          manualTasks: [],
          advertTasks: [],
          youtubeTasks: []
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        tasks: activities.tasks || [],
        manualTasks: activities.manualTasks || [],
        advertTasks: activities.advertTasks || [],
        youtubeTasks: activities.youtubeTasks || [],
      }
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
});

// Route to seed tasks
router.post('/seed-tasks', async (req, res) => {
  try {
    // Remove existing data
    await Activity.deleteMany({}).exec();

    // Create new document with dummy data
    const activity = new Activity(dummyData);
    await activity.save();

    res.status(200).json({
      success: true,
      message: 'Tasks seeded successfully',
      data: activity
    });
  } catch (error) {
    console.error('Error seeding tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding tasks',
      error: error.message
    });
  }
});

module.exports = router;