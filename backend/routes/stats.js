const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

// Get statistics for last 7 days
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const startDate = sevenDaysAgo.toISOString().split('T')[0];

    const query = `
    SELECT 
      DATE(hl.completed_at) as date,
      COUNT(DISTINCT hl.habit_id) as completed_count
    FROM habit_logs hl
    JOIN habits h ON hl.habit_id = h.id
    WHERE h.user_id = ? AND hl.completed_at >= ?
    GROUP BY DATE(hl.completed_at)
    ORDER BY date ASC
  `;

    db.all(query, [userId, startDate], (err, stats) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }

        res.json(stats);
    });
});

module.exports = router;
