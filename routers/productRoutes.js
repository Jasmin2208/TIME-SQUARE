const express = require("express")
const { authentication, isAdmin } = require("../middleware/autentication")
const formidableMiddleware = require('express-formidable');

const router = express.Router()

const { makeWishList, createProduct, getProduct, getSingleProduct, getByProductPhoto, deleteProduct, updateProduct, productFilter, productCount, productList, searchProduct, realtedProduct, productcategory, braintreeToken, braintreePayment, wishListProduct, getWishListProduct, deleteWishListProduct } = require("../controller/productController")

router.post("/create-product", authentication, isAdmin, formidableMiddleware(), createProduct)

router.put("/update-product/:pid", authentication, isAdmin, formidableMiddleware(), updateProduct)

router.get("/get-product", getProduct)

router.get("/single-product/:slug", getSingleProduct)

router.get("/product-photo/:pid", getByProductPhoto)

router.delete("/delete-product/:pid", authentication, isAdmin, deleteProduct)

router.post("/product-filter", productFilter)

router.get("/product-count", productCount)

router.get("/product-list/:page", productList)

router.get("/search/:keyword", searchProduct)

router.get("/related-product/:pid/:cid", realtedProduct)

router.get("/product-category/:slug", productcategory)

router.get("/braintree/token",braintreeToken)

router.post("/braintree/payment", authentication, braintreePayment)

router.post("/wish-list", authentication, wishListProduct)

router.get("/get-wish-list/:user", authentication, getWishListProduct)

router.put("/delete-wish-list/:user", authentication, deleteWishListProduct)

router.get("/makewish-list/:user",authentication, makeWishList)

module.exports = router
