const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = (req, res, next) => {
  try {
    console.log(req.headers.authorization);   //displays the authorization part i.e Type and Token
    const token = req.headers.authorization.split(' ')[1];  //splits Type and Token by ' ' and [1] here represents index 1.
    const decodedToken = jwt.verify(token, config.jwtSecret); //encodes token again(which gives the decoded version) with jwtSecret. Also, checks if token is expired or not.
    console.log(decodedToken);  //gives the decoded token.
    // const userId = decodedToken.userId;
    next();
    // if (req.body.userId && req.body.userId !== userId) {
    //   throw 'Invalid user ID';
    // } else {
    //   next();
    // }
  } catch {
    res.status(401).send({
      error: 'Authorization Failed. Invalid Token'
    });
  }
};