const express = require("express")
const router = express.Router()

const { register, login, test, forgotPassword, updateProfile, getOrders, getAdminOrders, orderStatus } = require("../controller/authController")

const { authentication, isAdmin } = require("../middleware/autentication")

router.post("/register",register)

router.post("/login", login)

router.post("/forgot-password", forgotPassword )

router.get("/test", authentication, isAdmin, test)

router.get("/user-auth", authentication, (req, res)=>{
    res.status(200).send({ ok: true })
})

router.get("/admin-auth", authentication, isAdmin, (req, res)=>{
    res.status(200).send({ ok: true })
})

router.put("/profile", authentication, updateProfile)

router.get("/orders", authentication, getOrders)

router.get("/all-orders", authentication, isAdmin, getAdminOrders)

router.put("/order-status/:orderId", authentication, isAdmin, orderStatus)




module.exports = router