const express = require("express");
const router = express.Router();
const verifyToken = require("./jwtVerify");
const fs = require("fs");
const path = require("path");
// using router to handle image uploads and source code uploads
const multer = require("multer");
// custom function to save the names uploaded
multer.addImageNames = function(imageName) {
  let fileNames = this.fileNames || [];
  fileNames.push(imageName);
  this.fileNames = fileNames;
};

// get images name
multer.getImageNames = function() {
  return this.fileNames;
};
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // check if uploads directory is available
    if (fs.existsSync("./uploads/")) {
      cb(null, "./uploads/");
    } else {
      // create the folder and upload the images in it
      fs.mkdirSync("./uploads");
      cb(null, "./uploads/");
    }
  },
  filename: function(req, file, cb) {
    if (!file.originalname) {
      file.originalname = file.fieldname + "file";
    }
    // function to create file name for the file uploading
    let newFileName =
      file.originalname.split(".")[0].replace(/\s+/g, "") +
      "-" +
      Date.now() +
      path.extname(file.originalname);
    multer.addImageNames({ field: file.fieldname, fileName: newFileName });
    cb(null, newFileName);
  }
});
// file filter function
function fileFilter(req, file, cb) {
  console.log(req.errorOccured);
  const body = req.body;
  console.log(file);
  if (!body.projectName || !body.projectDescription) {
    // check if the project name and project description is missing or not
    cb(new Error("PROJECT_NAME_MISSING"), false);
  }
  let imgMime = ["image/jpeg", "image/png"];
  if (
    imgMime.indexOf(file.mimetype) === -1 &&
    file.fieldname === "projectImage"
  ) {
    req.errorOccured = true;
    return cb(new Error("INVALID_FILE_TYPE"), false);
  } else if (file.fieldname === "projectCode") {
    cb(null, true);
  } else if (file.fieldname === "projectImage") {
    cb(null, true);
  } else {
    req.errorOccured = true;
    cb(new Error("UNEXPECTED_FILE"), false);
  }
}
// multer instance
const multerInstance = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 }
}).fields([
  { name: "projectName" },
  { name: "projectCode" },
  { name: "projectImage" },
  { name: "projectDescription" }
]);

// handling file upload
function fileHandlingMiddleWare(req, res, next) {
  multerInstance(req, res, function(err) {
    const body = req.body;
    // check whether the project name
    // or project description is missing
    if (!body.projectName || !body.projectDescription) {
      req.hasToRemoveFiles = true;
      req.statusMessage = "Project name or description missing";
      return next();
    }
    // check whether any files is missing
    if (!req.files.projectImage || !req.files.projectCode) {
      req.hasToRemoveFiles = true;
      req.statusMessage = "Please provide project image and code.";
      return next();
    }
    if (err) {
      // err.code is value set by multer
      req.hasToRemoveFiles = true;
      req.statusMessage = err.message;
      return next();
    } else {
      req.hasToRemoveFiles = false;
      req.statusMessage = "File uploading completed!";
      return next();
    }
  });
}
// file removing middleware
function removeFile(req, res, next) {
  if (req.hasToRemoveFiles) {
    let imagesNames = multer.getImageNames();
    
  }
}

// @access private
// @route domain/project/
router.use(verifyToken);
router.post("/upload", [fileHandlingMiddleWare, removeFile], function(
  req,
  res,
  next
) {
  res.send("Hello");
});
module.exports = router;
