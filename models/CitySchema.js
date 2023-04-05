const mongoose = require('mongoose')

const citySchema = new mongoose.Schema({
    name: String,
    location: {
        country: String,
        lat: Number,
        lon: Number
    }
})

module.exports = mongoose.model('city', citySchema)