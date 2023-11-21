const mongoose = require("mongoose");

const trainerSchema = mongoose.Schema({
  name: {
    type: String,
  },
  speciality: {
    type: String,
  },

  description: {
    type: String,
  },
});

const trainer = mongoose.model("Trainer", trainerSchema);
module.exports = trainer;
