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

    lang: {
        required: true,
        type: String,
    }

})

module.exports = mongoose.model('Promotion', proSchema);