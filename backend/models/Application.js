const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer',
        required: true,
    },
    program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

applicationSchema.index({ volunteer: 1, program: 1}, {unique: true});

module.exports = mongoose.model('Application', applicationSchema);