const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticateToken } = require('../middleware/auth');

// Get user settings
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    db.get('SELECT * FROM user_settings WHERE user_id = ?', [userId], (err, settings) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }

        if (!settings) {
            // Create default settings if not exists
            db.run(
                'INSERT INTO user_settings (user_id) VALUES (?)',
                [userId],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Lỗi server' });
                    }

                    db.get('SELECT * FROM user_settings WHERE id = ?', [this.lastID], (err, newSettings) => {
                        if (err) {
                            return res.status(500).json({ error: 'Lỗi server' });
                        }
                        res.json(newSettings);
                    });
                }
            );
        } else {
            res.json(settings);
        }
    });
});

// Update user settings
router.put('/', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const {
        daily_steps_goal,
        daily_calories_goal,
        daily_water_goal,
        glass_size,
        daily_sleep_goal,
        target_weight,
        start_weight,
    } = req.body;

    db.run(
        `INSERT INTO user_settings (user_id, daily_steps_goal, daily_calories_goal, daily_water_goal, 
     glass_size, daily_sleep_goal, target_weight, start_weight)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       daily_steps_goal = ?, daily_calories_goal = ?, daily_water_goal = ?, glass_size = ?,
       daily_sleep_goal = ?, target_weight = ?, start_weight = ?, updated_at = CURRENT_TIMESTAMP`,
        [
            userId, daily_steps_goal, daily_calories_goal, daily_water_goal, glass_size,
            daily_sleep_goal, target_weight, start_weight,
            daily_steps_goal, daily_calories_goal, daily_water_goal, glass_size,
            daily_sleep_goal, target_weight, start_weight,
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Lỗi server' });
            }

            db.get('SELECT * FROM user_settings WHERE user_id = ?', [userId], (err, settings) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.json(settings);
            });
        }
    );
});

module.exports = router;
