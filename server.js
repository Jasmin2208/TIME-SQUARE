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

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/product", productRoutes)


app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(PORT,()=>{
    console.log(`App Listen On PORT ${PORT}`)
})