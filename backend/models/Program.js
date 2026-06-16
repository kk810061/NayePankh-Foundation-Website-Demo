const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Program title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Program description is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    date: {
        type: Date, 
        required: [true, 'Program date is required'],
        default: Date.now
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: [true, 'Creator ID is required']
    }
}, { timestamps: true });

module.exports = mongoose.model('Program', ProgramSchema);