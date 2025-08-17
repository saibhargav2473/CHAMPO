require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// connect db
connectDB(process.env.MONGODB_URI);

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tournaments', require('./routes/tournaments'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
