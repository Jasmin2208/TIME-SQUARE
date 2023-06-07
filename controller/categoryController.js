const slugify = require("slugify")
const Category = require("../models/categoryModel")

const createCategory = async (req, res) => {

    try {
        const { name } = req.body
        if (!name) {
            return res.status(401).send({ message: "Name is required" })
        }

        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            return res.status(200).send({
                success: false,
                message: "Category Is Already Existing"
            })
        }

        const newCategory = await new Category({ name, slug: slugify(name) }).save()
        res.status(201).send({
            success: true,
            message: "Category Create Successfully !!",
            category: newCategory
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Create Category",
            error: error.message
        })
    }
}

const updateCategory = async (req, res) => {

    try {
        const { name } = req.body
        const { id } = req.params

        const updateCategory = await Category.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })

        res.status(201).send({
            success: true,
            message: "Category Update Successfully !!",
            category: updateCategory
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Update Category",
            error: error.message
        })
    }
}

const getCategory = async (req, res) => {

    try {

        const allCategory = await Category.find()

        res.status(201).send({
            success: true,
            message: "Category Get Successfully !!",
            category: allCategory
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Get Category",
            error: error.message
        })
    }
}

const deleteCategory = async (req, res) => {

    try {
        const { id } = req.params

        await Category.findByIdAndDelete({ _id: id })

        res.status(200).send({
            success: true,
            message: "Category Delete Successfully !!"
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Delete Category",
            error: error.message
        })
    }
}


const getSingleCategory = async (req, res) => {

    try {
        
        const category = await Category.findOne({ slug:req.params.slug })

        res.status(200).send({
            success: true,
            message: "Category Get Single Category Successfully !!",
            category
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Get Single Category Category",
            error: error.message
        })
    }
}


module.exports = { createCategory, updateCategory, getCategory, deleteCategory, getSingleCategory }