const express = require("express")
const path = require("path")
const methodOverride = require('method-override')
const Campground = require("./models/campground")


//getting mongoose
const mongoose = require("mongoose")
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

const app = express()
app.use(express.urlencoded({
    etended:
        true
}))
app.use(methodOverride('_method'))
//setting the view engine to EJS
app.set('view engine', 'ejs')
//setting the views directory
//sets up where to look for the views
app.set('views', path.join(__dirname, 'views'))
const port = 5000

app.get("/", (req, res) => {
    // res.send("hello")
    //.render is used to render a view template using ejs
    //can be used to render dynamically
    //what im passing in here is not the string to render
    //it is the file name
    res.render('home')
})

//an endpoint to test to see if the connection is working on mongodb
//keep in mind this is an async endpoint as there can be delay when adding to db, accessing the server etc

// app.get("/campground", async (req, res) => {
//     const camp = new Campground({
//         title: "Yosemeti",
//         descprition: "this is a test"
//     })
//     await camp.save()
//     res.send(camp)
// })

//we are using async bc it takes time
//we are passing the directoyy and the dependency to the .render
app.get("/campground", async (req, res) => {
    //method to get all of the data
    const camps = await Campground.find({})
    res.render("campground/index", { camps })
})

app.post("/campground", async (req, res) => {
    const add = new Campground(req.body.campground)
    await add.save()
    res.redirect(`/campground/${add._id}`)

})

//here, the order matters
//if this route was after the /campground/:id route
//then when we try to get /campground/new, it will treat new as an id 
//giving an error message
app.get("/campground/new", (req, res) => {
    res.render("campground/new")
})

app.get("/campground/:id", async (req, res) => {
    try {

        const camp_id = await Campground.findById(req.params.id)
        if (!camp_id) {
            return res.status(404).send("not found")
        }
        res.render("campground/show", { camp_id })
    } catch (err) {
        console.error(err)
        res.status(300).send("server error")
    }

})
app.get("/campground/:id/edit", async (req, res) => {

    const camp_id = await Campground.findById(req.params.id)
    // const
    res.render('campground/edit', { camp_id })

})

app.put("/campground/:id", async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findByIdAndUpdate(id,
        { ...req.body.campground })
    res.redirect(`/campground/${camp._id}`)
})

app.delete("/campground/:id", async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findByIdAndDelete(id)
    res.redirect(`/campground`)
})


app.listen(port, () => {
    console.log("listeing on ", port)
})
