const express = require("express");
const router = express.Router();
const verifyToken = require("./jwtVerify");
const fs = require("fs");
const path = require("path");
// using router to handle image uploads and source code uploads
const multer = require("multer");
// project model
const ProjectUploadSchema = require("../schema/project");
// custom function to save the names uploaded
multer.addImageNames = function(imageName) {
  let fileNames = this.fileNames || [];
  fileNames.push(imageName);
  this.fileNames = fileNames;
};

// get images name
multer.getImageNames = function() {
  console.log(this.fileNames);
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
  const body = req.body;
  if (!body.projectName || !body.projectDescription) {
    // check if the project name and project description is missing or not
    cb(new Error("PROJECT_NAME_MISSING"), false);
  }
  let imgMime = ["image/jpeg", "image/png"];
  // check if the file is image file
  if (
    imgMime.indexOf(file.mimetype) === -1 &&
    file.fieldname === "projectImage"
  ) {
    return cb(new Error("INVALID_FILE_TYPE"), false);
  } else if (file.fieldname === "projectCode") {
    cb(null, true);
  } else if (file.fieldname === "projectImage") {
    cb(null, true);
  } else {
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
  // check if the hasToRemoveFiles property is set
  if (req.hasToRemoveFiles) {
    // if some error or some field is null then
    // we need to remove the files which is uploaded
    let imagesNames = (function(imgNames) {
      // looping through the image array and getting the sring names of images
      let imgs = [];
      for (let i = 0; i < imgNames.length; i++) {
        imgs.push(imgNames[i].fileName);
      }
      return imgs;
    })(multer.getImageNames());
    let url, i;
    for (i = 0; i < imagesNames.length; i++) {
      url = "./uploads/" + imagesNames[i];
      // checking if the image is available
      if (fs.existsSync(url)) {
        // if the image is available delete it
        fs.unlink(url, err => console.log(err));
      }
    }
    return res.send({ msg: req.statusMessage, success: false });
  } else {
    let projectObject = {};
    // uploading the image information
    (function(images) {
      // looping through the image array and getting the sring names of images
      for (let i = 0; i < images.length; i++) {
        projectObject[images[i].field] = images[i].fileName;
      }
    })(multer.getImageNames());
    projectObject.projectName = req.body.projectName;
    projectObject.projectDescription = req.body.projectDescription;
    projectObject.projectDeveloper = req.userId;
    // creating new Model
    let projectModel = new ProjectUploadSchema(projectObject);
    projectModel.save(function(err) {
      if (!err) {
        return res.send({ msg: req.statusMessage, success: true });
      } else {
        return res.send({ msg: "Internal server error", success: false });
      }
    });
  }
}

// @access private
// @route domain/project/
router.use(verifyToken);
router.post("/upload", [fileHandlingMiddleWare, removeFile]);
module.exports = router;
