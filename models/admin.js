const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const adminSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
  },

  image: {},

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  gender: {
    type: String,
    default: null,
  },
});

// plugin findorcreate
adminSchema.plugin(findOrCreate);

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
