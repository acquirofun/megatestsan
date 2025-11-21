const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// Helper function to handle errors
const handleError = (res, error, message) => {
  console.error(message, error);
  res.status(500).json({
    success: false,
    message,
    error: error.message
  });
};

// GET all tasks of all types
router.get('/tasks/all', async (req, res) => {
  try {
    const activities = await Activity.findOne();
    res.status(200).json({
      success: true,
      data: {
        tasks: activities?.tasks || [],
        manualTasks: activities?.manualTasks || [],
        advertTasks: activities?.advertTasks || [],
        youtubeTasks: activities?.youtubeTasks || []
      }
    });
  } catch (error) {
    handleError(res, error, 'Error fetching tasks');
  }
});

// GET tasks by type (tasks, manualTasks, advertTasks, youtubeTasks)
router.get('/tasks/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['tasks', 'manualTasks', 'advertTasks', 'youtubeTasks'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task type'
      });
    }

    const activities = await Activity.findOne();
    res.status(200).json({
      success: true,
      data: activities?.[type] || []
    });
  } catch (error) {
    handleError(res, error, 'Error fetching tasks');
  }
});

// ADD new task
router.post('/tasks/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['tasks', 'manualTasks', 'advertTasks', 'youtubeTasks'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task type'
      });
    }

    // Validate required fields
    if (!req.body.id || !req.body.title) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Additional validation for regular tasks
    if (type === 'tasks' && !req.body.chatId) {
      return res.status(400).json({
        success: false,
        message: 'chatId is required for regular tasks'
      });
    }

    // Additional validation for YouTube tasks
    if (type === 'youtubeTasks' && (!req.body.description || !req.body.thumbnail)) {
      return res.status(400).json({
        success: false,
        message: 'description and thumbnail are required for YouTube tasks'
      });
    }

    let activities = await Activity.findOne();
    
    // If no activities document exists, create one
    if (!activities) {
      activities = new Activity({
        tasks: [],
        manualTasks: [],
        advertTasks: [],
        youtubeTasks: []
      });
    }

    // Add the new task to the appropriate array
    activities[type].push(req.body);
    await activities.save();

    res.status(201).json({
      success: true,
      data: activities[type]
    });
  } catch (error) {
    handleError(res, error, 'Error adding task');
  }
});

// UPDATE task by type and id
router.put('/tasks/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const validTypes = ['tasks', 'manualTasks', 'advertTasks', 'youtubeTasks'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task type'
      });
    }

    const activities = await Activity.findOne();
    if (!activities) {
      return res.status(404).json({
        success: false,
        message: 'No activities found'
      });
    }

    // Find the task index
    const taskIndex = activities[type].findIndex(task => task.id === parseInt(id));
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Update the task
    activities[type][taskIndex] = {
      ...activities[type][taskIndex].toObject(),
      ...req.body,
      id: parseInt(id) // Ensure ID remains the same
    };

    await activities.save();

    res.status(200).json({
      success: true,
      data: activities[type][taskIndex]
    });
  } catch (error) {
    handleError(res, error, 'Error updating task');
  }
});

// DELETE task by type and id
router.delete('/tasks/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const validTypes = ['tasks', 'manualTasks', 'advertTasks', 'youtubeTasks'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task type'
      });
    }

    const activities = await Activity.findOne();
    if (!activities) {
      return res.status(404).json({
        success: false,
        message: 'No activities found'
      });
    }

    // Remove the task
    activities[type] = activities[type].filter(task => task.id !== parseInt(id));
    await activities.save();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    handleError(res, error, 'Error deleting task');
  }
});

// GET task by type and id
router.get('/tasks/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const validTypes = ['tasks', 'manualTasks', 'advertTasks', 'youtubeTasks'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task type'
      });
    }

    const activities = await Activity.findOne();
    if (!activities) {
      return res.status(404).json({
        success: false,
        message: 'No activities found'
      });
    }

    const task = activities[type].find(task => task.id === parseInt(id));
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    handleError(res, error, 'Error fetching task');
  }
});

module.exports = router;