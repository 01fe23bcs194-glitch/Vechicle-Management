import mongoose from 'mongoose';

const servicePackageSchema = new mongoose.Schema({
    packageName: {
        type: String,
        required: [true, 'Package name is required'],
        trim: true
    },
    price: {
        type: String,
        required: [true, 'Price is required'],
        trim: true
    },
    servicesIncluded: {
        type: [String],
        required: [true, 'Services are required']
    },
    validity: {
        type: String,
        required: [true, 'Validity is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['Available', 'Expired'],
        default: 'Available'
    },
    imageUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800'
    }
}, {
    timestamps: true
});

const ServicePackage = mongoose.model('ServicePackage', servicePackageSchema);
export default ServicePackage;
