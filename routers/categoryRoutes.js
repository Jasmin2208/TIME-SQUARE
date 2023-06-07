const express = require("express")
const { authentication, isAdmin } = require("../middleware/autentication")
const router = express.Router()

const { createCategory, updateCategory, getCategory, deleteCategory, getSingleCategory } = require("../controller/categoryController")

router.post("/create-category", authentication, isAdmin, createCategory)

router.put("/update-category/:id", authentication, isAdmin, updateCategory)

router.get("/get-category", getCategory)

router.get("/single-category/:slug", getSingleCategory)

router.delete("/delete-category/:id", authentication, isAdmin, deleteCategory)

module.exports = router
