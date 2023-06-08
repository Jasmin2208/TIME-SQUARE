require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const database = require("./config/db")
const authRoutes = require("./routers/authRoutes")
const PORT = process.env.PORT
const app = express()
const cors = require("cors")
const categoryRoutes = require("./routers/categoryRoutes")
const productRoutes = require("./routers/productRoutes")
const path = require("path")

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname,"./client/build")))

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/product", productRoutes)

app.use("*", function(req, res){
  res.sendFile(path.join(__dirname,"./client/build/index.html"))
})

app.listen(PORT,()=>{
    console.log(`App Listen On PORT ${PORT}`)
})