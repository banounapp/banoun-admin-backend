const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connectusSchema = Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  text: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Connectus = mongoose.model("Connectus ", connectusSchema);

module.exports = Connectus;
