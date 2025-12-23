const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

// Get all habits for user
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    db.all(
        'SELECT * FROM habits WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, habits) => {
            if (err) {
                return res.status(500).json({ error: 'Lỗi server' });
            }
            res.json(habits);
        }
    );
});

// Create habit
router.post('/', authenticateToken, (req, res) => {
    const { name, description, color } = req.body;
    const userId = req.user.userId;

    if (!name) {
        return res.status(400).json({ error: 'Tên thói quen không được để trống' });
    }

    db.run(
        'INSERT INTO habits (user_id, name, description, color) VALUES (?, ?, ?, ?)',
        [userId, name, description || '', color || '#8b5cf6'],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Lỗi server' });
            }

            db.get('SELECT * FROM habits WHERE id = ?', [this.lastID], (err, habit) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.status(201).json(habit);
            });
        }
    );
});

// Update habit
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, description, color } = req.body;
    const userId = req.user.userId;

    db.run(
        'UPDATE habits SET name = ?, description = ?, color = ? WHERE id = ? AND user_id = ?',
        [name, description, color, id, userId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Lỗi server' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Không tìm thấy thói quen' });
            }

            db.get('SELECT * FROM habits WHERE id = ?', [id], (err, habit) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.json(habit);
            });
        }
    );
});

// Delete habit
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    db.run('DELETE FROM habits WHERE id = ? AND user_id = ?', [id, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Không tìm thấy thói quen' });
        }

        res.json({ message: 'Xóa thói quen thành công' });
    });
});

// Check-in (mark habit as done for today)
router.post('/:id/checkin', authenticateToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Verify habit belongs to user
    db.get('SELECT * FROM habits WHERE id = ? AND user_id = ?', [id, userId], (err, habit) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }

        if (!habit) {
            return res.status(404).json({ error: 'Không tìm thấy thói quen' });
        }

        db.run(
            'INSERT OR IGNORE INTO habit_logs (habit_id, completed_at) VALUES (?, ?)',
            [id, today],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }

                res.json({ message: 'Điểm danh thành công', date: today });
            }
        );
    });
});

module.exports = router;
