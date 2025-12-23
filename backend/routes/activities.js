const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

// ============ ACTIVITIES CRUD ============

// Get all activities
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const { date, limit = 50 } = req.query;

    let query = 'SELECT * FROM activities WHERE user_id = ?';
    const params = [userId];

    if (date) {
        query += ' AND date = ?';
        params.push(date);
    }

    query += ' ORDER BY date DESC, time DESC LIMIT ?';
    params.push(parseInt(limit));

    db.all(query, params, (err, activities) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }
        res.json(activities);
    });
});

// Create activity
router.post('/', authenticateToken, (req, res) => {
    const { name, duration, calories, distance, time, date } = req.body;
    const userId = req.user.userId;

    if (!name || !duration || !calories || !date) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    db.run(
        'INSERT INTO activities (user_id, name, duration, calories, distance, time, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, name, duration, calories, distance || null, time || null, date],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Lỗi server' });
            }

            db.get('SELECT * FROM activities WHERE id = ?', [this.lastID], (err, activity) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.status(201).json(activity);
            });
        }
    );
});

// Update activity
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, duration, calories, distance, time, date } = req.body;
    const userId = req.user.userId;

    db.run(
        'UPDATE activities SET name = ?, duration = ?, calories = ?, distance = ?, time = ?, date = ? WHERE id = ? AND user_id = ?',
        [name, duration, calories, distance, time, date, id, userId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Lỗi server' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Không tìm thấy hoạt động' });
            }

            db.get('SELECT * FROM activities WHERE id = ?', [id], (err, activity) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.json(activity);
            });
        }
    );
});

// Delete activity
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    db.run('DELETE FROM activities WHERE id = ? AND user_id = ?', [id, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Không tìm thấy hoạt động' });
        }

        res.json({ message: 'Xóa hoạt động thành công' });
    });
});

// ============ DAILY SUMMARY ============

// Get daily summary
router.get('/summary', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const { date, days = 7 } = req.query;

    if (date) {
        // Get specific date
        db.get(
            'SELECT * FROM daily_activity_summary WHERE user_id = ? AND date = ?',
            [userId, date],
            (err, summary) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.json(summary || { date, steps: 0, distance: 0, calories: 0, active_minutes: 0 });
            }
        );
    } else {
        // Get last N days
        db.all(
            'SELECT * FROM daily_activity_summary WHERE user_id = ? ORDER BY date DESC LIMIT ?',
            [userId, parseInt(days)],
            (err, summaries) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.json(summaries);
            }
        );
    }
});

// Update daily summary
router.post('/summary', authenticateToken, (req, res) => {
    const { date, steps, distance, calories, active_minutes } = req.body;
    const userId = req.user.userId;

    if (!date) {
        return res.status(400).json({ error: 'Thiếu ngày' });
    }

    db.run(
        `INSERT INTO daily_activity_summary (user_id, date, steps, distance, calories, active_minutes)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, date) DO UPDATE SET
       steps = ?, distance = ?, calories = ?, active_minutes = ?, updated_at = CURRENT_TIMESTAMP`,
        [userId, date, steps || 0, distance || 0, calories || 0, active_minutes || 0,
            steps || 0, distance || 0, calories || 0, active_minutes || 0],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Lỗi server' });
            }

            db.get(
                'SELECT * FROM daily_activity_summary WHERE user_id = ? AND date = ?',
                [userId, date],
                (err, summary) => {
                    if (err) {
                        return res.status(500).json({ error: 'Lỗi server' });
                    }
                    res.json(summary);
                }
            );
        }
    );
});

module.exports = router;
