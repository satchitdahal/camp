const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
//setting up mongo connection using some flags
mongoose.connect('mongodb://localhost:27017/camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("connected to db")
})

const app = express()
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
app.listen(port, () => {
    console.log("listeing on ", port)
})