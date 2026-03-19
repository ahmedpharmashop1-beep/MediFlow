const mongoose = require('mongoose');
const shema = mongoose.Schema;

const foodSchema = new shema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
        default:["meat", "vegetables", "fruits", "fish"]
    },
    price: Number,

    profile_image: String,
    cloudinary_id: String
}, { timestamps: true }
);

module.exports = Food = mongoose.model('food', foodSchema);