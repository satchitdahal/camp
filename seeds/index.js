const mongoose = require("mongoose")
const cities = require('./cities')
const { places, descriptors } = require('./seedhelpers')

const Campground = require("../models/campground")

//getting mongoose
//setting up mongo connection using some flags
//establish a connection to mongodb server which in this case is locahost
mongoose.connect('mongodb://localhost:27017/camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
})
//here wew are accessing the connected object
//the object with the connection
//this is also a shortcut
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Connected to the database")
})

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    // const c = new Campground({
    //     title: "prasanna gay"
    // })
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save()
    }

}
seedDB().then(() => {
    db.close()
    console.log("connection ended")
})