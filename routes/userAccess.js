const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/keys").jwtSecret;
// signup model
const SignUpModel = require("../schema/signup");
// token model
const TokenModel = require("../schema/token");
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
    bcrypt.hash(password, 10, function(err, hashedPassword) {
      // checking if their is any error
      if (err) {
        res.send({ success: false, msg: "Something went wrong! err" });
        return;
      }
      user = new SignUpModel({ email, password: hashedPassword });
      user.save(function(err) {
        if (err) {
          console.log(err);
          if (err.code === 11000) {
            res.json({ success: false, msg: "Account already available!" });
          } else {
            res.json({
              success: false,
              msg: "Something went wrong!"
            });
          }
        } else {
          // create jwt token
          jwt.sign(
            { id: user.id },
            jwtSecret,
            {
              expiresIn: 60 * 60
            },
            function(err, token) {
              if (err) {
                res.status(500).send({ success: false, msg: "server error" });
              } else {
                res.json({
                  success: true,
                  msg: "User created!",
                  token: token
                });
              }
            }
          );
        }
      });
    });
  } else {
    res.json({ success: false, msg: "Please provide password and email" });
  }
});

/*  # @route domain/user/login          *
 *  # @desc login route for user access *
 *  # @access public                    */
router.post("/login", function(req, res) {
  // @param email and password
  let email = req.body.email,
    password = req.body.password,
    query = SignUpModel.findOne({ email: email });

  query.then(result => {
    if (result === null) {
      res.send({ success: false, msg: "User is not registered" });
    } else {
      // compare password
      bcrypt.compare(password, result.password, function(err, compareResult) {
        // checking if their is any error
        if (err) {
          res.send({ success: false, msg: "Something went wrong!" });
          return;
        }
        // check if the password is matched
        if (compareResult) {
          // create jwt token
          jwt.sign(
            { id: result._id },
            jwtSecret,
            {
              expiresIn: 60 * 60
            },
            function(err, token) {
              if (err) {
                console.log(err);
                res.status(500).send({
                  success: false,
                  msg: "server error"
                });
              } else {
                res.json({
                  success: true,
                  msg: "User logged in!",
                  token: token
                });
              }
              console.log(err);
            }
          );
        } else {
          res.send({ success: false, msg: "Password doesn't match" });
        }
      });
    }
  });
});

/*
 * route for logging out the user from the session
 * @route domain/user/logout
 * @desc route for logging out the user
 * @access public
 */
router.get("/logout", (req, res) => {
  const bearer = req.headers.authorization;
  if (bearer) {
    const token = bearer.split(" ")[1];
    //saving the token to database
    let newToken = new TokenModel({ token: token, isExpired: false });
    newToken.save(function(err) {
      if (err) {
        res.send({ success: false, msg: "Error in logging out" });
      } else {
        res.send({
          success: true,
          statusCode: 200,
          error: "User logged out!"
        });
      }
    });
  } else {
    res.json({
      success: false,
      statusCode: 401,
      error: "Token not provided"
    });
  }
});

module.exports = router;
