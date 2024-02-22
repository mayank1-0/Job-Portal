var express = require("express"); //import express module in 'express' variable
var auth = require("../middleware/auth");
var router = express.Router(); // an express application is created in 'router' variable using Router() method of express variable. Basically, a Router object is created in 'router' variable.
const users = require("../controllers/userController");
/* GET users listing. */
router.get("/", auth, users.getUser); //Here, users.getUser is a callback metod and we don't use () for callback functions. if we don't pass any value in url i.e localhost:3000/users then NOT FOUND Error. Here, auth acts as a policy, security, validation, checkpoint between / and users.getUser.

module.exports = router;
