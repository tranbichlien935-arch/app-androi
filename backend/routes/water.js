const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

// ============ WATER LOGS CRUD ============

// Get water logs
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const { date, days = 7 } = req.query;

    if (date) {
        // Get specific date
        db.all(
            'SELECT * FROM water_logs WHERE user_id = ? AND date = ? ORDER BY time ASC',
            [userId, date],
            (err, logs) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                const total = logs.reduce((sum, log) => sum + log.amount, 0);
                res.json({ logs, total });
            }
        );
    } else {
        // Get last N days summary
        db.all(
            `SELECT date, SUM(amount) as total_amount
       FROM water_logs
       WHERE user_id = ?
       GROUP BY date
       ORDER BY date DESC
       LIMIT ?`,
            [userId, parseInt(days)],
            (err, summary) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.json(summary);
            }
        );
    }
});

// Add water log
router.post('/', authenticateToken, (req, res) => {
    const { date, amount, time } = req.body;
    const userId = req.user.userId;

    if (!date || !amount) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    db.run(
        'INSERT INTO water_logs (user_id, date, amount, time) VALUES (?, ?, ?, ?)',
        [userId, date, amount, time || null],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Lỗi server' });
            }

            db.get('SELECT * FROM water_logs WHERE id = ?', [this.lastID], (err, log) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.status(201).json(log);
            });
        }
    );
});

// Update water log
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { amount, time } = req.body;
    const userId = req.user.userId;

    db.run(
        'UPDATE water_logs SET amount = ?, time = ? WHERE id = ? AND user_id = ?',
        [amount, time, id, userId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Lỗi server' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Không tìm thấy bản ghi' });
            }

            db.get('SELECT * FROM water_logs WHERE id = ?', [id], (err, log) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.json(log);
            });
        }
    );
});

// Delete water log
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    db.run('DELETE FROM water_logs WHERE id = ? AND user_id = ?', [id, userId], function (err) {
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
