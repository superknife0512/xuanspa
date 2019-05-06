const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    brand:{
        type: String,
        required: true,
    },

    desc:{
        type: String,
        required: true,
    },

    imgUrl: String,

    blobName: String,

    lang: String
})

module.exports = mongoose.model('Product', productSchema);