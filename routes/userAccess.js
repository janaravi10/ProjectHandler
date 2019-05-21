const express = require("express");
const router = express.Router();
// signup model
const SignUp = require("../schema/signup");
router.post("/signup", function(req, res) {
  let email = req.body.email,
    password = req.body.password;
    
});

router.get("/", function(req, res) {
  res.send("success");
});

module.exports = router;
