const mongoose = require('mongoose');

const messSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: false,
        default: 1
    },
    time :{
        type: String,
    },
    isBook: {
        type: Boolean,
        require: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }
}, {timestamps: true})

module.exports = mongoose.model('Message', messSchema);