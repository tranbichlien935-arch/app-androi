const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');

const JWT_SECRET = 'your-secret-key-change-in-production';

// Register
router.post('/register', async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        db.run(
            'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
            [fullName, email, passwordHash],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({ error: 'Email đã được sử dụng' });
                    }
                    return res.status(500).json({ error: 'Lỗi server' });
                }

                const token = jwt.sign({ userId: this.lastID }, JWT_SECRET, { expiresIn: '30d' });
                res.status(201).json({
                    message: 'Đăng ký thành công',
                    token,
                    user: { id: this.lastID, fullName, email },
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Vui lòng điền email và mật khẩu' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
        res.json({
            message: 'Đăng nhập thành công',
            token,
            user: { id: user.id, fullName: user.full_name, email: user.email },
        });
    });
});

module.exports = router;
