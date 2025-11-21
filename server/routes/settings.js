// routes/settings.js
const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// Dummy data with default settings
const defaultSettings = {
  tonWallet: "jdsflncdszfjblndzmxfvkjdkxf",
  coolDownTime: 3200000,
  tappingGuru: 5
};

// Route to get settings
router.get('/codec-settings', async (req, res) => {
  try {
    const settings = await Settings.findOne().lean();
    
    if (!settings) {
      return res.status(200).json({
        success: true,
        data: {
          tonWallet: "",
          coolDownTime: 0,
          tappingGuru: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
});

// Route to seed settings
router.post('/seed-settings', async (req, res) => {
  try {
    // Remove existing data
    await Settings.deleteMany({}).exec();
    
    // Create new document with default data
    const settings = new Settings(defaultSettings);
    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Settings seeded successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error seeding settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding settings',
      error: error.message
    });
  }
});


// Route to update settings
router.put('/settings/update', async (req, res) => {
    try {
      const { tonWallet, coolDownTime, tappingGuru } = req.body;
  
      // Validate required fields
      if (tonWallet === undefined || coolDownTime === undefined || tappingGuru === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          error: 'INVALID_INPUT'
        });
      }
  
      // Find and update settings
      const updatedSettings = await Settings.findOneAndUpdate(
        {}, // Find first document
        {
          tonWallet,
          coolDownTime,
          tappingGuru
        },
        { 
          new: true, // Return updated document
          upsert: true // Create if doesn't exist
        }
      ).lean();
  
      if (!updatedSettings) {
        return res.status(404).json({
          success: false,
          message: 'Settings not found',
          error: 'SETTINGS_NOT_FOUND'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        data: updatedSettings
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating settings',
        error: error.message
      });
    }
  });



module.exports = router;