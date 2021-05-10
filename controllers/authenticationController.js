const jwt = require('jsonwebtoken');        //imported and stored jwt module.
const config = require('../config.json');   // imported and stored config.json file.

const demoUser = {                          //created an object demoUser containing 
  _id: 22031995,                            // id,
  email: 'rajesh@studiographene.com',       // email,
  password: '1234567'                       // password.           
};

const userRegistration = async(req, res) => {   // async makes a function return a Promise OR The word “async” before a function means one simple thing: a function always returns a promise.
  try {
    let postData = req.body;   //This line means, whatever data is being sent in the post request(through POSTMAN) is stored in postData.
    res.send({status: 200, data: postData, message: 'API Success Message'}); // sending a response
  } catch(e) {
    res.send({status: 500, data: e, message: 'API Error Message'}); // sending a response
  }
};

const userLogin = async(req, res) => {        // async makes a function return a Promise.
  try {
    console.log(config.jwtSecret);            // printing jwtSecret from config.json to console.
    if(req.body.email !== demoUser.email) {   // checks if entered email and email in demoUser and their type aren't same.
      res.status(401).send({message: 'User not found'});  //send a response.
    } else if(req.body.password !== demoUser.password) {  //checks if entered password and password in demoUser and their type aren't same.
      res.status(401).send({message: 'Invalid password'});//send a response.
    } else {
      const token = jwt.sign({ userId: demoUser._id }, config.jwtSecret, { expiresIn: '24h' }); //Signs the given payload into a JSON webtoken. OR converts payload into encrypted form. jwt.sign(payload, secretOrPrivateKey, [options, callback]). payload could be an object literal, buffer or string representing valid JSON.
      res.status(200).send({token, message: 'Login Successfull'});  //send a response.  
    }
  } catch(e) {
    res.status(500).send({error: e, message: 'Login failed. Please try again'});  //send a response.
  }
};

module.exports = {
  userRegistration,
  userLogin  
};