const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

// ============ SLEEP LOGS CRUD ============

// Get sleep logs
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const { date, days = 7 } = req.query;

    if (date) {
        // Get specific date
        db.get(
            'SELECT * FROM sleep_logs WHERE user_id = ? AND date = ?',
            [userId, date],
            (err, log) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.json(log || null);
            }
        );
    } else {
        // Get last N days
        db.all(
            'SELECT * FROM sleep_logs WHERE user_id = ? ORDER BY date DESC LIMIT ?',
            [userId, parseInt(days)],
            (err, logs) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.json(logs);
            }
        );
    }
});

// Add/Update sleep log
router.post('/', authenticateToken, (req, res) => {
    const { date, bed_time, wake_time, total_hours, quality, deep_sleep, light_sleep, rem_sleep } = req.body;
    const userId = req.user.userId;

    if (!date || !bed_time || !wake_time || !total_hours) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    db.run(
        `INSERT INTO sleep_logs (user_id, date, bed_time, wake_time, total_hours, quality, deep_sleep, light_sleep, rem_sleep)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, date) DO UPDATE SET
       bed_time = ?, wake_time = ?, total_hours = ?, quality = ?, deep_sleep = ?, light_sleep = ?, rem_sleep = ?`,
        [userId, date, bed_time, wake_time, total_hours, quality, deep_sleep, light_sleep, rem_sleep,
            bed_time, wake_time, total_hours, quality, deep_sleep, light_sleep, rem_sleep],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Lỗi server' });
            }

            db.get(
                'SELECT * FROM sleep_logs WHERE user_id = ? AND date = ?',
                [userId, date],
                (err, log) => {
                    if (err) {
                        return res.status(500).json({ error: 'Lỗi server' });
                    }
                    res.json(log);
                }
            );
        }
    );
});

// Update sleep log
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { bed_time, wake_time, total_hours, quality, deep_sleep, light_sleep, rem_sleep } = req.body;
    const userId = req.user.userId;

    db.run(
        `UPDATE sleep_logs SET bed_time = ?, wake_time = ?, total_hours = ?, quality = ?, 
     deep_sleep = ?, light_sleep = ?, rem_sleep = ? WHERE id = ? AND user_id = ?`,
        [bed_time, wake_time, total_hours, quality, deep_sleep, light_sleep, rem_sleep, id, userId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Lỗi server' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Không tìm thấy bản ghi' });
            }

            db.get('SELECT * FROM sleep_logs WHERE id = ?', [id], (err, log) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.json(log);
            });
        }
    );
});

// Delete sleep log
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    db.run('DELETE FROM sleep_logs WHERE id = ? AND user_id = ?', [id, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Không tìm thấy bản ghi' });
        }

        res.json({ message: 'Xóa bản ghi thành công' });
    });
});

module.exports = router;
