import mongoose from 'mongoose';
import ServicePackage from './models/servicePackageSchema.js';

const uri = 'mongodb+srv://01fe23bcs194_db_user:vehicle@cluster0.jh3own1.mongodb.net/vehicle-service?appName=Cluster0';

mongoose.connect(uri)
    .then(async () => {
        console.log('Connected to Cloud DB...');
        const count = await ServicePackage.countDocuments();
        console.log(`\n✅ PACKAGE COUNT: ${count}`);

        if (count > 0) {
            const pkgs = await ServicePackage.find({}, 'packageName price');
            console.log('-----------------------------------');
            pkgs.forEach(p => console.log(`- ${p.packageName} (${p.price})`));
            console.log('-----------------------------------');
        } else {
            console.log('⚠️ db is empty!');
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
