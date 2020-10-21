const mongoose = require('mongoose');
const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    banners: [
        {
            img: { type: String },
            navigateTo: { type: String }
        }
    ],
    products: [
        {
            img: { type: String },
            navigateTo: { type: String }
        }
    ],
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true ,
        unique: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('Page', pageSchema);