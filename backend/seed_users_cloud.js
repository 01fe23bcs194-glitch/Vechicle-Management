import mongoose from 'mongoose';
import User from './models/userSchema.js';

const uri = 'mongodb+srv://01fe23bcs194_db_user:vehicle@cluster0.jh3own1.mongodb.net/vehicle-service?appName=Cluster0';

// Users to seed (password: 123456)
const seedUsers = [
    {
        name: "Prajwal",
        email: "prajwalchabbi268@gmail.com",
        password: "password123",
        role: "user"
    },
    {
        name: "Admin",
        email: "admin@kletech.ac.in",
        password: "adminpassword",
        role: "admin"
    }
];

mongoose.connect(uri)
    .then(async () => {
        console.log('Connected to Cloud DB for User Seeding...');

        for (const u of seedUsers) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                await User.create(u); // Schema pre-save will hash password
                console.log(`✅ Added user: ${u.email}`);
            } else {
                console.log(`ℹ️ User already exists: ${u.email}`);
            }
        }

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
