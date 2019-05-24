const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// defining schema
const TokenSchema = new Schema({
  token: {
    required: true,
    type: String
  },
  isExpired: {
    type: Boolean
  }
});

// exporting model
module.exports = mongoose.model("tokens", TokenSchema);
