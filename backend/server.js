import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import { readData, writeData } from './utils/jsonStore.js';
import ServicePackage from './models/servicePackageSchema.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
let dbConnected = false;
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ MongoDB connected successfully');
        dbConnected = true;
        app.set('dbConnected', true);

        // Auto-seed if empty
        try {
            const count = await ServicePackage.countDocuments();
            if (count === 0) {
                console.log('📦 Seeding initial packages to MongoDB...');
                await ServicePackage.insertMany(initialPackages);
                console.log('✅ Seeding complete');
            }
        } catch (err) {
            console.error('⚠️ Seeding failed:', err.message);
        }
    })
    .catch((err) => {
        console.log('⚠️ MongoDB connection error (using JSON storage):', err.message);
        dbConnected = false;
        app.set('dbConnected', false);
    });

// Initialize JSON files if empty
const initialPackages = [
    {
        id: 'PKG-BMW',
        packageName: "BMW M-Performance Care",
        price: "₹25000",
        servicesIncluded: ["Full Engine Scan", "Synthetic Oil Change", "Brake Pad Replacement", "Ceramic Coating"],
        validity: "24 months",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1555214144-8488e34892c9?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 'PKG-1',
        packageName: "Basic Service",
        price: "₹3500",
        servicesIncluded: ["Oil Change", "Washing", "Brake Inspection", "Filter Check"],
        validity: "6 months",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1517672651691-24622a91b550?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 'PKG-2',
        packageName: "Hyundai Creta Care",
        price: "₹5500",
        servicesIncluded: ["Oil Change", "Wheel Alignment", "AC Checkup", "Body Polish"],
        validity: "9 months",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 'PKG-3',
        packageName: "Mahindra Thar Edition",
        price: "₹8000",
        servicesIncluded: ["Off-road Inspection", "Synthetic Oil", "Underbody Cleaning", "4x4 Check"],
        validity: "12 months",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 'PKG-4',
        packageName: "XUV 700 Premium",
        price: "₹12000",
        servicesIncluded: ["ADAS Calibration Check", "Full Detailing", "Engine Tuning", "Sensor Mapping"],
        validity: "18 months",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1494905998402-395d637a6323?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 'PKG-5',
        packageName: "Toyota Fortuner Legend",
        price: "₹18000",
        servicesIncluded: ["Heavy Duty Service", "Ceramic Wax", "Interior Deep Clean", "Chassis Lubrication"],
        validity: "24 months",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1626084300329-843815f91722?auto=format&fit=crop&q=80&w=800"
    }
];

if (readData('packages').length === 0) {
    writeData('packages', initialPackages);
}
if (!fs.existsSync(path.join(process.cwd(), 'data/users.json'))) {
    writeData('users', []);
}
if (!fs.existsSync(path.join(process.cwd(), 'data/bookings.json'))) {
    writeData('bookings', []);
}

// Global middleware to inject JSON data if needed
app.use((req, res, next) => {
    req.jsonStore = { readData, writeData };
    next();
});

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for easier deployment troubleshooting
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/packages', packageRoutes);

// Root route
app.get('/', (req, res) => {
    const isDB = app.get('dbConnected');
    res.status(200).json({
        success: true,
        message: `Welcome to Keep Hubli Cars Service API (${isDB ? 'MongoDB Connected' : 'JSON Store Mode'})`,
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', db: app.get('dbConnected') ? 'MongoDB' : 'JSON' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
