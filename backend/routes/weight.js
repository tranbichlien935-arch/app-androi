const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

// ============ WEIGHT LOGS CRUD ============

// Get weight logs
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const { limit = 30 } = req.query;

    db.all(
        'SELECT * FROM weight_logs WHERE user_id = ? ORDER BY date DESC LIMIT ?',
        [userId, parseInt(limit)],
        (err, logs) => {
            if (err) {
                return res.status(500).json({ error: 'Lỗi server' });
            }
            res.json(logs);
        }
    );
});

// Add weight log
router.post('/', authenticateToken, (req, res) => {
    const { date, weight } = req.body;
    const userId = req.user.userId;

    if (!date || !weight) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    // Get user height to calculate BMI
    db.get('SELECT height FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }

        let bmi = null;
        if (user && user.height) {
            const heightInMeters = user.height / 100;
            bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        }

        db.run(
            'INSERT INTO weight_logs (user_id, date, weight, bmi) VALUES (?, ?, ?, ?)',
            [userId, date, weight, bmi],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }

                db.get('SELECT * FROM weight_logs WHERE id = ?', [this.lastID], (err, log) => {
                    if (err) {
                        return res.status(500).json({ error: 'Lỗi server' });
                    }
                    res.status(201).json(log);
                });
            }
        );
    });
});

// Update weight log
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { weight, date } = req.body;
    const userId = req.user.userId;

    // Get user height to recalculate BMI
    db.get('SELECT height FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }

        let bmi = null;
        if (user && user.height) {
            const heightInMeters = user.height / 100;
            bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        }

        db.run(
            'UPDATE weight_logs SET weight = ?, bmi = ?, date = ? WHERE id = ? AND user_id = ?',
            [weight, bmi, date, id, userId],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }

                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Không tìm thấy bản ghi' });
                }

                db.get('SELECT * FROM weight_logs WHERE id = ?', [id], (err, log) => {
                    if (err) {
                        return res.status(500).json({ error: 'Lỗi server' });
                    }
                    res.json(log);
                });
            }
        );
    });
});

// Delete weight log
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    db.run('DELETE FROM weight_logs WHERE id = ? AND user_id = ?', [id, userId], function (err) {
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
