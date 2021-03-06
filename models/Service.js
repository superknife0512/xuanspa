const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    desc: [{
        type: String,
    }],
    
    tag:{
        type: String,
        required: true,
    },

    imgUrls:[{
        type: String,
        required: true,
    }],

    views:{
        type: Number,
        default: 10,
    },

    price:{
        type: Number,
        required: true,
    },

    blobNames: [String],

    time: {
        type: Number,
        required: true,
    },
    lang:{
        type: String
    }

}, {timestamps: true})

module.exports = mongoose.model('Service', serviceSchema);