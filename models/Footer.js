const mongoose = require('mongoose');


const footerSchema = new mongoose.Schema({
    fb: {
        type: String,
        required: true,
    },
    talk: {
        type: String,
        required: true,
    },
    trip: {
        type: String,
        required: true,
    },
    ig: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Footer', footerSchema)