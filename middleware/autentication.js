const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");

const authentication = async (req, res, next) => {
    try {
        const decode = await jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY)
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: "Invalid Token",
            error: error.message
        })
    }
}

const isAdmin = async (req, res, next) => {
    try {
        const user = await Users.findById(req.user._id)
        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "UnAuthorized Access"
            })
        } else {
            next();
        }
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: "Error In Admin Middleware",
            error: error.message
        })
    }
}

module.exports = { authentication, isAdmin }