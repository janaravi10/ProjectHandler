const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// defining schema
const ProjectUploadSchema = new Schema({
  projectImage: {
    type: String,
    required: true,
    unique: true
  },
  projectCode: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  projectDescription: {
    type: String,
    required: true
  },
  projectDeveloper: { type: String, required: true }
});

// exporting model
module.exports = mongoose.model("projects", ProjectUploadSchema);
