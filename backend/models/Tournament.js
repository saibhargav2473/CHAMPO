const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  registeredAt: { type: Date, default: Date.now }
});

const tournamentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sport: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  description: String,
  imageUrl: String,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [participantSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tournament', tournamentSchema);
