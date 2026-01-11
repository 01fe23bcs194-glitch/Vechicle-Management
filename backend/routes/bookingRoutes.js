import express from 'express';
import Booking from '../models/bookingSchema.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Get all bookings (Admin only)
router.get('/bookings', protect, adminOnly, async (req, res) => {
    try {
        const dbConnected = req.app.get('dbConnected');
        if (dbConnected) {
            const bookings = await Booking.find().sort({ createdAt: -1 });
            res.status(200).json({ success: true, bookings });
        } else {
            const bookings = req.jsonStore.readData('bookings');
            res.status(200).json({ success: true, bookings: bookings.reverse() });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create new booking
router.post('/bookService', protect, async (req, res) => {
    try {
        const { customerName, packageName, vehicleType, vehicleName, notes } = req.body;
        const dbConnected = req.app.get('dbConnected');

        if (!customerName || !packageName || !vehicleType || !vehicleName) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dbConnected) {
            const count = await Booking.countDocuments({ createdAt: { $gte: today } });
            const queueNumber = `Q-${count + 1}`;

            const hour = 9 + Math.floor(count * 30 / 60);
            const minute = (count * 30) % 60;
            const serviceTime = `${hour}:${minute === 0 ? '00' : minute} AM`;

            const newBooking = new Booking({
                customerName: customerName.trim(),
                packageName: packageName.trim(),
                vehicleType: vehicleType.trim(),
                vehicleName: vehicleName.trim(),
                notes: notes ? notes.trim() : undefined,
                queueNumber,
                serviceTime,
                status: 'Confirmed'
            });
            await newBooking.save();
            return res.status(201).json({ success: true, message: 'Booking created', booking: newBooking });
        } else {
            const bookings = req.jsonStore.readData('bookings');
            const todayBookings = bookings.filter(b => new Date(b.bookingDate).setHours(0, 0, 0, 0) === today.getTime());

            const count = todayBookings.length;
            const queueNumber = `Q-${count + 1}`;

            const hour = 9 + Math.floor(count * 30 / 60);
            const minute = (count * 30) % 60;
            const serviceTime = `${hour}:${minute === 0 ? '00' : minute} AM`;

            const newBooking = {
                id: 'BOOK-' + Date.now(),
                customerName: customerName.trim(),
                packageName: packageName.trim(),
                vehicleType: vehicleType.trim(),
                vehicleName: vehicleName.trim(),
                notes: notes ? notes.trim() : undefined,
                queueNumber,
                serviceTime,
                status: 'Confirmed',
                bookingDate: new Date().toISOString(),
                address: 'Keep Hubli Service, Gokul Road, Hubli'
            };

            bookings.push(newBooking);
            req.jsonStore.writeData('bookings', bookings);

            return res.status(201).json({ success: true, message: 'Booking created (Persistent JSON)', booking: newBooking });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
