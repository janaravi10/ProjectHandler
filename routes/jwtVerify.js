let jwt = require("jsonwebtoken"),
  jwtSecret = require("../config/keys").jwtSecret,
  TokenModel = require("../schema/token");

/*  # @middleware function              *
 *  # @access public and verify the jwt */
module.exports = function verifyToken(req, res, next) {
  // getting the token header
  const bearer = req.headers.authorization;
  if (bearer) {
    const token = bearer.split(" ")[1];
    // finding whether this token is stored in the logout collection
    // if it is stored then this is already logged out token
    let sql = "SELECT * FROM tokens WHERE ?";
    let query = TokenModel.find({ token: token });
    query.then(result => {
      if (result.length) {
        jwt.verify(token, jwtSecret, function(err, decoded) {
          if (err) {
            // jwt verification failed then update the isExpired value to true
            TokenModel.findOneAndUpdate(
              { token },
              { isExpired: true },
              function(err, res) {
                if (err) {
                  console.log(err);
                }
              }
            );
          }
          console.log("giving error here drer");
          // send token expired header because user logged out this jwt token
          res.json({
            success: false,
            statusCode: 401,
            error: "Token Expired!",
            message: "You are not logged in!"
          });
        });
      } else {
        // jwt verify this token
        jwt.verify(token, secret, function(err, decoded) {
          if (err) {
            console.log("giving error here");
            res.json({
              success: false,
              statusCode: 401,
              error: "Token Expired!"
            });
            console.log(err);
          } else {
            console.log(decoded);
            // setting the user id;
            req.userId = decoded.id;
            // if jwt verified successfully call next middleware
            next();
          }
        });
      }
    });
  } else {
    res.json({
      success: false,
      statusCode: 401,
      error: "Unauthorized user!",
      message: "Unauthorized user!"
    });
  }
};
