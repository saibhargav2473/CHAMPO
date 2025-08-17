const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const ensureRole = require('../middleware/role');
const Tournament = require('../models/Tournament');
const User = require('../models/User');

// Multer local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Create tournament (organizer only)
router.post('/', auth, (req, res, next) => {
    
  next();
}, ensureRole('organizer'), upload.single('image'), async (req, res) => {


  try {
    const { title, sport, location, date, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const t = new Tournament({
      title, sport, location, date,
      description, imageUrl,
      organizer: req.user.id
    });
    await t.save();
    res.json(t);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tournaments (with optional filters: sport, location, search)
router.get('/', async (req, res) => {
  try {
    const { sport, location, search, organizerOnly } = req.query;
    const q = {};
    if (sport) q.sport = sport;
    if (location) q.location = location;
    if (search) q.title = { $regex: search, $options: 'i' };
    if (organizerOnly && req.query.organizerId) {
      q.organizer = req.query.organizerId;
    }
    const tournaments = await Tournament.find(q).populate('organizer', 'name email');
    res.json(tournaments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tournament by id (with participants)
router.get('/:id', async (req, res) => {
  try {
    const t = await Tournament.findById(req.params.id).populate('organizer', 'name email').populate('participants.userId', 'name email');
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json(t);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit tournament (organizer only and must be the organizer)
router.put('/:id', auth, ensureRole('organizer'), upload.single('image'), async (req, res) => {
  try {
    const t = await Tournament.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Not found' });
    if (t.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { title, sport, location, date, description } = req.body;
    if (title) t.title = title;
    if (sport) t.sport = sport;
    if (location) t.location = location;
    if (date) t.date = date;
    if (description) t.description = description;
    if (req.file) t.imageUrl = `/uploads/${req.file.filename}`;
    await t.save();
    res.json(t);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete tournament (organizer only)
router.delete('/:id', auth, ensureRole('organizer'), async (req, res) => {
  try {
    const t = await Tournament.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Not found' });
    if (t.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
   
    await t.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Register for a tournament (participant)
router.post('/:id/register', auth, ensureRole('participant'), async (req, res) => {
  try {
    const t = await Tournament.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Not found' });

    const already = t.participants.find(p => p.userId && p.userId.toString() === req.user.id);
    if (already) return res.status(400).json({ message: 'Already registered' });

    const user = await User.findById(req.user.id);
    t.participants.push({
      userId: user._id,
      name: user.name,
      email: user.email
    });
    await t.save();
    res.json({ message: 'Registered', tournament: t });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get participants for tournament (organizer)
router.get('/:id/participants', auth, ensureRole('organizer'), async (req, res) => {
  try {
    const t = await Tournament.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Not found' });
    if (t.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(t.participants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
