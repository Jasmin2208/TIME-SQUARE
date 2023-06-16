const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        id: {
          type: mongoose.ObjectId,
          ref: "Products",

        },
        quantity: {
          type: Number
        }
      }
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    }
  },
  { timestamps: true }
);

const Orders = mongoose.model("Order", orderSchema);

module.exports = Orders;

// {
//   id: {
//     type: mongoose.ObjectId,
//     ref: "Products",
//   },
//   quantity: {
//     type: String,
//     default: "1"
//   }
// }