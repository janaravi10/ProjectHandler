const express = require("express");
const app = express();
// routes
const userAccess = require("./routes/userAccess");
// @port for server
const port = process.env.PORT || 5000;
app.use("/user", userAccess);
app.get("/hello", function(req, res) {
  res.send("hello");
});
app.listen(port, () => console.log("Server started on " + port));
