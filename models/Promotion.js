const mongoose = require('mongoose');

const proSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    desc:{
        type: String,
        required: true,
    },
    discount:{
        type: Number,
        required: true,
    },
    timeStart:{
        type: String,
        required: true
    },
    
    timeEnd:{
        type: String,
        required: true
    },

    imgUrl: String,

    blobName: String,

    lang: {
        required: true,
        type: String,
    }

}, {timestamps: true})

module.exports = mongoose.model('Promotion', proSchema);