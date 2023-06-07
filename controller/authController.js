const Users = require("../models/userModel")
var jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require("../authentication/protection")
const Orders = require("../models/orderModel")

const register = async (req, res) => {

    try {
        const { name, email, password, phone, address, question } = req.body

        if (!name) {
            return res.send({ message: "Name is required" })
        }
        if (!email) {
            return res.send({ message: "Email is required" })
        }

        if (!password) {
            return res.send({ message: "Password is required" })
        }

        if (!phone) {
            return res.send({ message: "Phone is required" })
        }

        if (!address) {
            return res.send({ message: "Address is required" })
        }

        if (!question) {
            return res.send({ message: "Question is required" })
        }

        // Check existing user

        const existingUser = await Users.findOne({ email })
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "User Has Already Register So Please Login!!"
            })
        }

        //Register new user

        const hashedPassword = await hashPassword(password)
        const createUser = new Users({ name, email, password: hashedPassword, phone, address, question })
        await createUser.save()
        res.status(201).send({
            success: true,
            message: "User Register Successfully!!",
            User: createUser
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Registration",
            error: error.message
        })

    }

}

const login = async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid Email and Password"
            })
        }

        const user = await Users.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Invalid Email"
            })
        }

        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(404).send({
                success: false,
                message: "Invalid Password"
            })
        }

        //Generate Token
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })
        return res.status(200).send({
            success: true,
            message: "Login Successfully!!",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Login",
            error: error.message
        })

    }

}

const test = (req, res) => {
    res.send("protected")
}

const forgotPassword = async (req, res) => {

    try {

        const { email, answer, password } = req.body;

        if (!email) {
            res.status(400).send({ message: "Email is required" })
        }
        if (!answer) {
            res.status(400).send({ message: "Answer is required" })
        }
        if (!password) {
            res.status(400).send({ message: "Password is required" })
        }

        const user = await Users.findOne({ email, question: answer })

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email and Answer",
                error: error.message
            })
        }

        const hashed = await hashPassword(password);

        await Users.findByIdAndUpdate({ _id: user._id }, { password: hashed })

        return res.status(201).send({
            success: true,
            message: "Password Updated Successfully !!"
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Forgot Password",
            error: error.message
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body

        const user = await Users.findById(req.user._id)

        if (password && password.length < 6) {
            return res.send({ message: "Password is required and atmost 6 character" })
        }

        const hashedPassword = password ? await hashPassword(password) : undefined

        const updateUser = await Users.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            email: email || user.email,
            phone: phone || user.phone,
            address: address || user.address,
            password: hashedPassword || user.password
        }, { new: true })

        return res.status(201).send({
            success: true,
            message: "Profile Updated Successfully !!",
            updateUser
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Update Profile",
            error: error.message
        })
    }
}

const getOrders = async (req, res) => {
    try {
        const orders = await Orders.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name")
        res.status(200).send({
            success: true,
            message: "get Order",
            orders
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Get Orders",
            error: error.message
        })
    }
}

const getAdminOrders = async (req, res) => {
    try {
        const orders = await Orders.find({}).populate("products", "-photo").populate("buyer", "name").sort({ createdAt: "-1" });
        res.status(200).send({
            success: true,
            message: "get Order",
            orders
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Get Admin Orders",
            error: error.message
        })
    }
}

const orderStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body

        const updateStatus = await Orders.findByIdAndUpdate(orderId, { status }, { new: true })

        res.status(200).send({
            success: true,
            message: "Update Order Status",
            updateStatus
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Change Orders Status",
            error: error.message
        })
    }
}

module.exports = { register, login, test, forgotPassword, updateProfile, getOrders, getAdminOrders, orderStatus }