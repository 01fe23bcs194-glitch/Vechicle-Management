import express from 'express';
import ServicePackage from '../models/servicePackageSchema.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// GET all packages
router.get('/', async (req, res) => {
    try {
        const dbConnected = req.app.get('dbConnected');
        if (dbConnected) {
            const packages = await ServicePackage.find();
            res.status(200).json({ success: true, packages });
        } else {
            const packages = req.jsonStore.readData('packages');
            res.status(200).json({ success: true, packages });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin Only Routes
router.use(protect);
router.use(adminOnly);

// CREATE package
router.post('/', async (req, res) => {
    try {
        const { packageName, price, servicesIncluded, validity, status, imageUrl } = req.body;
        const dbConnected = req.app.get('dbConnected');

        if (dbConnected) {
            const newPackage = await ServicePackage.create({ packageName, price, servicesIncluded, validity, status, imageUrl });
            res.status(201).json({ success: true, package: newPackage });
        } else {
            const packages = req.jsonStore.readData('packages');
            const newPackage = {
                id: 'PKG-' + Date.now(),
                packageName, price, servicesIncluded, validity, status, imageUrl
            };
            packages.push(newPackage);
            req.jsonStore.writeData('packages', packages);
            res.status(201).json({ success: true, package: newPackage });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// UPDATE package
router.put('/:id', async (req, res) => {
    try {
        const dbConnected = req.app.get('dbConnected');
        if (dbConnected) {
            const updatedPackage = await ServicePackage.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json({ success: true, package: updatedPackage });
        } else {
            let packages = req.jsonStore.readData('packages');
            const index = packages.findIndex(p => p.id === req.params.id);
            if (index !== -1) {
                packages[index] = { ...packages[index], ...req.body };
                req.jsonStore.writeData('packages', packages);
                res.status(200).json({ success: true, package: packages[index] });
            } else {
                res.status(404).json({ success: false, message: 'Package not found' });
            }
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE package
router.delete('/:id', async (req, res) => {
    try {
        const dbConnected = req.app.get('dbConnected');
        if (dbConnected) {
            await ServicePackage.findByIdAndDelete(req.params.id);
            res.status(200).json({ success: true, message: 'Package deleted' });
        } else {
            let packages = req.jsonStore.readData('packages');
            packages = packages.filter(p => p.id !== req.params.id);
            req.jsonStore.writeData('packages', packages);
            res.status(200).json({ success: true, message: 'Package deleted' });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

export default router;
