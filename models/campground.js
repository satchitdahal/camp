const mongoose = require("mongoose")
//this is a shortcut
//instead of doing mongoose.Schema.whatever all the time
const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
    title: String,
    price: String,
    descprition: String,
    location: String
})

module.exports = mongoose.model('Campground', CampgroundSchema)