const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  tonWallet: {
    type: String,
    required: true
  },
  coolDownTime: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  tappingGuru: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

// Create indexes if needed
SettingsSchema.index({ tonWallet: 1 });

// Compile model from schema
const Settings = mongoose.model('Settings', SettingsSchema);

module.exports = Settings;