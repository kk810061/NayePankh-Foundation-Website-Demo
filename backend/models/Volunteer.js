const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true
    },
    skills: {
        type: [String],
        default: []
    },
    availability: {
        type: String,
        required: [true, "Availability is required"],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);