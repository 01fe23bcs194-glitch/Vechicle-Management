import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import mongoose from 'mongoose';

export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'You are not logged in. Please log in to get access.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

        const dbConnected = req.app.get('dbConnected');
        let currentUser;

        // 1. Hardcoded checks for default users
        if (decoded.id === 'ADMIN-SITE') {
            currentUser = { id: 'ADMIN-SITE', name: 'System Administrator', email: 'admin123', role: 'admin' };
        } else if (decoded.id === 'USER-SITE') {
            currentUser = { id: 'USER-SITE', name: 'Standard User', email: 'user123', role: 'user' };
        }
        // 2. Try MongoDB if connected and ID looks like an ObjectId
        else if (dbConnected && mongoose.Types.ObjectId.isValid(decoded.id)) {
            try {
                currentUser = await User.findById(decoded.id);
            } catch (err) {
                currentUser = null;
            }
        }

        // 3. Try JSON store if not found yet
        if (!currentUser) {
            try {
                const users = req.jsonStore.readData('users') || [];
                const foundInJson = users.find(u => u.id === decoded.id || u._id === decoded.id);
                if (foundInJson) {
                    const { password, ...userWithoutPassword } = foundInJson;
                    currentUser = { ...userWithoutPassword, id: foundInJson.id || foundInJson._id };
                }
            } catch (err) {
                currentUser = null;
            }
        }

        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: 'Your session has expired. Please log in again.'
            });
        }

        // Grant access to protected route
        req.user = currentUser;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token or session expired.'
        });
    }
};
