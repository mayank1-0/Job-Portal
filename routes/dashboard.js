var express = require("express");
var router = express.Router();
const dashboardController = require("../controllers/dashboardController");

/* GET home page. */
router.get("/dashboard", dashboardController.getDashboard); //when localhost:3000/users/dashboard url is entered in browser it will execute getDashboard function inside dashboardController.js

module.exports = router;
