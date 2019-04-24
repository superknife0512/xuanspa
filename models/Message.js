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