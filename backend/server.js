const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const activitiesRoutes = require('./routes/activities');
const waterRoutes = require('./routes/water');
const sleepRoutes = require('./routes/sleep');
const weightRoutes = require('./routes/weight');
const settingsRoutes = require('./routes/settings');

app.use('/auth', authRoutes);
app.use('/activities', activitiesRoutes);
app.use('/water', waterRoutes);
app.use('/sleep', sleepRoutes);
app.use('/weight', weightRoutes);
app.use('/settings', settingsRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Health Tracker API đang chạy! 🚀' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
