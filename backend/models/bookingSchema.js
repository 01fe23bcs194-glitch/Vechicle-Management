import mongoose from 'mongoose';

/**
 * MongoDB Schema for Service Bookings
 * Stores customer booking information for vehicle service packages
 */
const bookingSchema = new mongoose.Schema({
  // Customer Information
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    minlength: [2, 'Customer name must be at least 2 characters'],
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },

  // Package Information
  packageName: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true
  },

  // Vehicle Information
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    trim: true,
    minlength: [2, 'Vehicle type must be at least 2 characters']
  },

  vehicleName: {
    type: String,
    required: [true, 'Vehicle name is required'],
    trim: true
  },

  // Booking details
  queueNumber: {
    type: String
  },

  serviceTime: {
    type: String
  },

  address: {
    type: String,
    default: '123 AutoCare Street, Service Zone, City 560001'
  },

  // Booking Status
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },

  // Booking Date
  bookingDate: {
    type: Date,
    default: Date.now
  },

  // Additional Notes (optional)
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Indexes for better query performance
bookingSchema.index({ customerName: 1, bookingDate: -1 });
bookingSchema.index({ status: 1 });

// Virtual field to check if booking is recent (within 24 hours)
bookingSchema.virtual('isRecent').get(function () {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.bookingDate >= oneDayAgo;
});

// Instance method to update booking status
bookingSchema.methods.updateStatus = function (newStatus) {
  this.status = newStatus;
  return this.save();
};

// Static method to find bookings by customer
bookingSchema.statics.findByCustomer = function (customerName) {
  return this.find({ customerName: new RegExp(customerName, 'i') });
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
