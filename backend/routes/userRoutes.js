import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userSchema.js';

const router = express.Router();

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const dbConnected = req.app.get('dbConnected');
        const role = email.includes('admin') ? 'admin' : 'user';

        if (dbConnected) {
            const newUser = await User.create({ name, email, password, role });
            const token = signToken(newUser._id);
            return res.status(201).json({
                success: true,
                token,
                user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
            });
        } else {
            const users = req.jsonStore.readData('users');
            if (users.find(u => u.email === email)) {
                return res.status(400).json({ success: false, message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = {
                id: 'USER-' + Date.now(),
                name,
                email,
                password: hashedPassword,
                role
            };

            users.push(newUser);
            req.jsonStore.writeData('users', users);

            const token = signToken(newUser.id);
            return res.status(201).json({
                success: true,
                token,
                user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
            });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const dbConnected = req.app.get('dbConnected');

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Hardcoded Logins for Quick Testing
        if (email === 'admin123' && password === 'admin@12345') {
            const adminUser = { id: 'ADMIN-SITE', name: 'System Administrator', email: 'admin123', role: 'admin' };
            return res.status(200).json({ success: true, token: signToken(adminUser.id), user: adminUser });
        }
        if (email === 'user123' && password === '123456') {
            const defaultUser = { id: 'USER-SITE', name: 'Standard User', email: 'user123', role: 'user' };
            return res.status(200).json({ success: true, token: signToken(defaultUser.id), user: defaultUser });
        }

        if (dbConnected) {
            const user = await User.findOne({ email }).select('+password');
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ success: false, message: 'Incorrect email or password' });
            }
            const token = signToken(user._id);
            return res.status(200).json({
                success: true,
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role }
            });
        } else {
            const users = req.jsonStore.readData('users');
            const user = users.find(u => u.email === email);

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ success: false, message: 'Incorrect email or password' });
            }

            const token = signToken(user.id);
            return res.status(200).json({
                success: true,
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role }
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

export default router;
