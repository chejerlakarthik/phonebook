const mongoose = require('mongoose');

const phoneSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    countryCode: {
        type: Number,
        required: true
    },
    created: Date,
    lastUpdated: Date
});

module.exports = mongoose.model('Phone', phoneSchema);