const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

module.exports = (req, res, next) => {
  try {
    console.log(req.headers.authorization);
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, config.jwtSecret);
    console.log(decodedToken);
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