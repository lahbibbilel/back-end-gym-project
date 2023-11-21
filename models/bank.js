const mongoose = require("mongoose");

const BankSchema = mongoose.Schema({
  cardNumber: {
    type: String,
    required: [true, "Card number is required"],
  },
  solde: {
    type: Number,
    required: [true, "solde number is required"],
  },
});

const Bank = mongoose.model("Bank", BankSchema);
module.exports = Bank;
