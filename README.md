# ProjectHandler
A website app to handle revisions of software between the developer and the clients

## Installation
run  `npm install`

After that 
run `npm start`
# Database integration
I have use mongoatlas for the database.
### How to setup the database string 
- goto config folder and create new javascript file with name of 
keys_dev.js
- `module.exports = {
  mongoURI:Your mongodb uri from mongocloud,
  secretOrKey: "secret",jwtSecret: "secretofthejwt"
};
 `