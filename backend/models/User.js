const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name must be provided'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email must be provided'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'Volunteer',
        trim: true,
        enum:{
            values: ['Volunteer', 'Admin'],
            message : '{VALUE} is not supported'
        }
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema);