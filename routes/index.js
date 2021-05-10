var express = require('express'); //creates a variable express which holds the variables and functions of express.js(imports)
var router = express.Router(); //creates new router object. This object is used to handle http requests. We used the express file's Router() function to create a object 'router'.
var authentication = require('../controllers/authenticationController');

/* GET home page. */
router.get('/', function(req, res, next) {  //get() method has 2 parameters. First argument is the path of the route. Second argument is a function which is invoked and itself takes three arguments
  res.render('index', { title: 'Express' }); //will search index file in views folder and there provides value "Express" for the key 'title'. Also, we can either use res.render() or res.send().
});

router.post('/user-registration', authentication.userRegistration); //if url has localhost:3000/user-registration then will invoke authentication.userRegistration() method
router.post('/user-login', authentication.userLogin);               //if url has localhost:3000/user-registration then will invoke callback authentication.userRegistration()

module.exports = router;
