const jwt = require("jsonwebtoken");
const config = require("../config.json");

module.exports = (req, res, next) => {
  try {
    //console.log('Session Data: ', req.session.user, 'Token: ', req.session.token, 'Header: ', req.headers.authorization);
    console.log(req.headers.authorization); //displays the authorization part i.e Type and Token
    const token = req.headers.authorization.split(" ")[1]; //splits Type and Token by ' ' and [1] here represents index 1.
    console.log(
      "Session Data: ",
      req.session.user,
      "Token: ",
      req.session.token
    );
    if (req.session.user && req.session.token && req.session.token === token) {
      const decodedToken = jwt.verify(token, config.jwtSecret); //encodes token again(which gives the decoded version) with jwtSecret. Also, checks if token is expired or not.
      //console.log(decodedToken);  //gives the decoded token.
      const tokenStatus = decodedToken.isActive;
      if (tokenStatus) {
        next();
      } else {
        throw "Invalid token";
      }
    } else if (!req.session.token) {
      console.log(
        "##########TOKEN VERIFIED. API ACCESS VIA REST CLIENT########"
      );
      const decodedToken = jwt.verify(token, config.jwtSecret);
      console.log(decodedToken);
      const tokenStatus = decodedToken.isActive;
      if (tokenStatus) {
        next();
      } else {
        throw "Invalid token";
      }
    } else {
      throw "Invalid token";
    }
    // const userId = decodedToken.userId;
    //next();
    // if (req.body.userId && req.body.userId !== userId) {
    //   throw 'Invalid user ID';
    // } else {
    //   next();
    // }
  } catch {
    res.status(401).send({
      error: "Authorization Failed. Invalid Token",
    });
  }
};
