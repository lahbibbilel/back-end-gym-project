const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const productShema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "enter your title"],
  },
  image: {
    type: String,
    required: [true, "enter your image"],
  },
  description: {
    type: String,
    required: [true, "enter your description"],
  },
  key_feature: {
    type: String,
    required: [true, "enter your key feature"],
  },
  prix: {
    type: Number,
  },
});

productShema.virtual("users", {
  ref: "Users",
  localField: "_id",
  foreignField: "product",
});

const product = mongoose.model("Products", productShema);
module.exports = product;
