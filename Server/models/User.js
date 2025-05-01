const mongoose = require('mongoose');

const watchedIntervalSchema = new mongoose.Schema({
  start: { type: Number, required: true },
  end: { type: Number, required: true },
});

const videoDataSchema = new mongoose.Schema({
  videoId: { type: String, required: true },
  watchedIntervals: { type: [watchedIntervalSchema], default: [] },
  resumePoint: { type: Number, default: 0 },
  videoLength: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    videoData: { type: [videoDataSchema], default: [] },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
