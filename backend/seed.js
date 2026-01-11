import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ServicePackage from './models/servicePackageSchema.js';

dotenv.config();

const seedPackages = [
    {
        packageName: "BMW M-Performance Care",
        price: "₹25000",
        servicesIncluded: ["Full Engine Scan", "Synthetic Oil Change", "Brake Pad Replacement", "Ceramic Coating"],
        validity: "24 months",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800"
    },
    {
        packageName: "Basic Service",
        price: "₹3500",
        servicesIncluded: ["Oil Change", "Washing", "Brake Inspection", "Filter Check"],
        validity: "6 months",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800"
    },
    {
        packageName: "Hyundai Creta Care",
        price: "₹5500",
        servicesIncluded: ["Oil Change", "Wheel Alignment", "AC Checkup", "Body Polish"],
        validity: "9 months",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800"
    },
    {
        packageName: "Mahindra Thar Edition",
        price: "₹8000",
        servicesIncluded: ["Off-road Inspection", "Synthetic Oil", "Underbody Cleaning", "4x4 Check"],
        validity: "12 months",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800"
    },
    {
        packageName: "XUV 700 Premium",
        price: "₹12000",
        servicesIncluded: ["ADAS Calibration Check", "Full Detailing", "Engine Tuning", "Sensor Mapping"],
        validity: "18 months",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800"
    },
    {
        packageName: "Toyota Fortuner Legend",
        price: "₹18000",
        servicesIncluded: ["Heavy Duty Service", "Ceramic Wax", "Interior Deep Clean", "Chassis Lubrication"],
        validity: "24 months",
        status: "Available",
        imageUrl: "https://images.unsplash.com/photo-1626084300329-843815f91722?auto=format&fit=crop&q=80&w=800"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await ServicePackage.deleteMany({});
        await ServicePackage.insertMany(seedPackages);
        console.log("Database seeded successfully with BMW and other models");
        process.exit();
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedDB();
