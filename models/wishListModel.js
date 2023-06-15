const mongoose = require("mongoose")

const wishListSchema = new mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        ref: "user",
        required: true,
    },
    products: [
        {
          type: mongoose.ObjectId,
          ref: "Products",
        },
      ]
}, {
    timestamps: true
})

const wishList = mongoose.model("Wish", wishListSchema)

module.exports = wishList 