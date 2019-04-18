const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    shortDesc: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    delta: {
        type: String,
        required: true
    },
    html:{
        type: String,
    },
    imgUrl: {
        type:String,
        required: true
    },
    lang: {
        type:String
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Blog', blogSchema);