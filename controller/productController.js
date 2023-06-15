
const Product = require("../models/productModel")
const fs = require("fs")
const slugify = require("slugify")
const Category = require("../models/categoryModel")
const braintree = require("braintree");
const Orders = require("../models/orderModel")
const Wish = require("../models/wishListModel");
const { errorMonitor } = require("events");
require("dotenv").config()

let gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const createProduct = async (req, res) => {

    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = new Product({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();

        res.status(201).send({
            success: true,
            message: "Product Create Successfully !!",
            products
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Create Product",
            error: error.message
        })
    }
}

const getProduct = async (req, res) => {

    try {
        const products = await Product.find({}).populate("category").select("-photo").sort({ createdAt: -1 });

        res.status(201).send({
            success: true,
            message: "Product Getting Successfully !!",
            products,
            count: products.length
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Getting Product",
            error: error.message
        })
    }
}

const getSingleProduct = async (req, res) => {

    try {

        const product = await Product.findOne({ slug: req.params.slug }).populate("category").select("-photo")

        res.status(200).send({
            success: true,
            message: "Category Get Single Product Successfully !!",
            product
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Get Single Product Category",
            error: error.message
        })
    }
}

const getByProductPhoto = async (req, res) => {

    try {

        const product = await Product.findById(req.params.pid).select("photo");

        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Get Product By Photo Category",
            error: error.message
        })
    }
}


const deleteProduct = async (req, res) => {

    try {

        await Product.findByIdAndDelete(req.params.pid).select("-photo");

        res.status(200).send({
            success: true,
            message: "Product Delete Successfully !!"
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Delete Product Category",
            error: error.message
        })
    }
}

const updateProduct = async (req, res) => {

    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = await Product.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        res.status(201).send({
            success: true,
            message: "Product Update Successfully !!",
            products
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Update Product",
            error: error.message
        })
    }
}

const productFilter = async (req, res) => {

    try {
        const { checked, radio } = req.body

        let args = {}

        if (checked.length > 0) args.category = checked

        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }

        const products = await Product.find(args);

        res.status(200).send({
            success: true,
            message: "Products Filter Successfully !!",
            products
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Filter Product",
            error: error.message
        })
    }
}

const productCount = async (req, res) => {

    try {
        const total = await Product.find({}).estimatedDocumentCount()

        res.status(200).send({
            success: true,
            message: "Product Count Succesfully !!",
            total
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Count Product",
            error: error.message
        })
    }
}

const productList = async (req, res) => {
    try {
        const perPage = 8;

        const page = req.params.page ? req.params.page : 1;

        const products = await Product.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In List of Product",
            error: error.message
        })
    }
}

const searchProduct = async (req, res) => {
    try {
        const { keyword } = req.params

        const result = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo")

        res.status(200).send(result)
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Search of Product",
            error: error.message
        })
    }
}

const realtedProduct = async (req, res) => {
    try {
        const { pid, cid } = req.params

        const product = await Product.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(3).populate("category")

        res.status(200).send({
            success: true,
            product
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In get related Product",
            error: error.message
        })
    }
}

const productcategory = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug })

        const product = await Product.find({ category }).populate("category")

        res.status(200).send({
            success: true,
            category,
            product
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In get Category Wise Product",
            error: error.message
        })
    }
}

const braintreeToken = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(response)
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Braintree Token",
            error: error.message
        })
    }
}

const braintreePayment = async (req, res) => {
    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    const order = new Orders({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Braintree Payment",
            error: error.message
        })
    }
}

const wishListProduct = async (req, res) => {
    try {
        const { user, product } = req.body

        const userData = await Wish.findOne({ user: user })

        if (userData) {
            const isProductLiked = userData.products.some((p) => p._id == product);
            if (isProductLiked) {
                return res.status(200).send({
                    error: false,
                    message: 'Product already liked',
                });
            }

            if (userData) {
                const addProduct = await Wish.findByIdAndUpdate({ _id: userData._id }, { $push: { products: product } }, { new: true })

                return res.status(201).send({
                    success: true,
                    addProduct,
                    message: "Use Wish Product add Successfully"
                })
            }

            const wishProducts = await new Wish({
                user, products: product
            }).save()

            return res.status(200).send({
                success: true,
                wishProducts,
                message: "Use Wish Product"
            })

        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In WishList",
            error: error.message
        })
    }
}


const getWishListProduct = async (req, res) => {

    try {
        const { user } = req.params

        const getData = await Wish.findOne({ user: user })

        const products = await Product.find({ "_id": { "$in": getData.products } }).select('-photo')

        res.status(200).send({
            success: false,
            message: "get In WishList product",
            products
        })

    } catch (error) {
        console.log("err--->", error);
        res.status(500).send({
            success: false,
            message: "Error In getWishList",
            error: error.message
        })
    }
}

const deleteWishListProduct = async (req, res) => {

    try {
        const { user } = req.params

        const { product } = req.body

        if (product) {
            await Wish.updateMany({ user: user }, { $pull: { products: { $in: [product] } } }, { new: true })
            return res.status(200).send({
                success: true,
                message: "delete In WishList",
            })
        } else {
            await Wish.updateOne({ user: user }, { $set: { products: [] } }, { new: true });
            return res.status(200).send({
                success: true,
                message: "sfsf delete In WishList",
            })
        }



    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In delete WishList",
            error: error.message
        })
    }
}

const makeWishList = async (req, res) => {
    try {

        const { user } = req.params

        const [data] = await Wish.find(
            { user: user }
        );

        console.log("d->", data)

        res.json({
            error: false,
            product: data.products
        })

    } catch (error) {
        res.status(400).json({
            error: true,
            errorMessage: error.message,
            message: 'Error while liked product',
        });
    }
}

module.exports = { makeWishList, createProduct, getProduct, getSingleProduct, getByProductPhoto, deleteProduct, updateProduct, productFilter, productCount, productList, searchProduct, realtedProduct, productcategory, braintreeToken, braintreePayment, wishListProduct, getWishListProduct, deleteWishListProduct }