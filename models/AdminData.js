const mongoose = require('mongoose');

const richtextSchema = new mongoose.Schema({
    delta: String,
    html: String
})


const adminSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
        required: true,
    },
    heroImgUrl: {
        type: String,
    },
    gallerieUrls:[{
        type: String,
    }],
    defaultEmail: {
        type: String,
    },
    recruitContent: richtextSchema,
    aboutContent: richtextSchema,
    lang: String,
})

module.exports = mongoose.model('AdminData', adminSchema)