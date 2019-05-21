// database
const mongoose = require("mongoose");
const mongoUrl = require("../config/keys").mongoURI;
console.log(mongoUrl);
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    dbName: "projectHandler",
    useCreateIndex: true
  })
  .then(() => {
    console.log("connected");
  })
  .catch(err => {
    console.log(err);
  });

