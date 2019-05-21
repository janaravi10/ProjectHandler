const express = require("express");
const router = express.Router();
// signup model
const SignUpModel = require("../schema/signup");
/*  # @route domain/user/signup      *
 *  # @desc signup route to let user *
 *  # signup for the account         *
 *  # @access public                 */
router.post("/signup", function(req, res) {
  // @param email and password
  let email = req.body.email,
    password = req.body.password,
    user;
  // check if both email && password is available
  if (email && password) {
    user = new SignUpModel({ email, password });
    user.save(function(err) {
      if (err) {
        console.log(err);
        res.json({ success: false, msg: "Something went wrong!" });
      } else {
        res.json({ success: true, msg: "User created!" });
      }
    });
  } else {
    res.json({ success: false, msg: "Please provide password and email" });
  }
});

module.exports = router;
