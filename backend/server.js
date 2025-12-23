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
const habitsRoutes = require('./routes/habits');
const statsRoutes = require('./routes/stats');

app.use('/auth', authRoutes);
app.use('/habits', habitsRoutes);
app.use('/stats', statsRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Habit Tracker API đang chạy! 🚀' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
