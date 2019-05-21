// database
const mongoose = require("mongoose");
const mongoUrl = require("./config/keys").mongoURI;
console.log(mongoUrl);
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true
  })
  .then(() => {
    /*  # console.log("connected"); */
  })
  .catch(err => {
    console.log(err);
  });
var db = mongoose.connection;
db.on("open", function() {
  console.log("connected");
});
