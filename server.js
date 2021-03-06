const express = require("express");
const app = express();
const db = require("./db_connection/db");
const bodyParser = require("body-parser");
// routes
const userAccess = require("./routes/userAccess");
const projectRoute = require("./routes/projectRoute");
// @port for server
const port = process.env.PORT || 5000;
// use middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// routes for user login and signup access
app.use("/user", userAccess);
//routes for uploading project
app.use("/project",projectRoute);
app.listen(port, () => console.log("Server started on " + port));
