const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "User ID is required for the cart"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: [true, "Product ID is required for the cart"],
  },
  number_months: {
    type: Number,
    //default: 0, // You can set a default quantity if needed
  },
  cardNumber: {
    type: String,
    required: [true, "Card number is required"],
  },
});

const Cart = mongoose.model("Panier", cartSchema);
module.exports = Cart;
