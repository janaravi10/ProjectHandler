const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// defining schema
const SignUpSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// exporting model
module.exports = mongoose.model("user", SignUpSchema);
