const jwt = require("jsonwebtoken"); //imported and stored jwt module.
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const moment = require("moment");
const config = require("../config.json"); // imported and stored config.json file.
const db = require("../db/models");
const User = db.Users; //???????????????????????????????????????????????
const Op = db.Sequelize.Op; //??????????????????????????????????????????

// const demoUser = {                          //created an object demoUser containing
//   _id: 22031995,                            // id,
//   email: 'rajesh@studiographene.com',       // email,
//   password: '1234567'                       // password.
// };

const userRegistration = async (req, res) => {
  // async makes a function return a Promise OR The word “async” before a function means one simple thing: a function always returns a promise.
  try {
    let postData = req.body; //This line means, whatever data is being sent in the post request(through POSTMAN) is stored in postData.
    //res.send({status: 200, data: postData, message: 'API Success Message'}); // sending a response
    postData.userID = `${moment().unix()}-${randomstring.generate({
      //Generating random string. randomstring is a package used to generate a random string.To make it unique we have attached time stamp to it, moment().unix() is the current timestamp generated in milliseconds.
      length: 6,
      readable: true,
      capitalization: "uppercase",
      charset: "alphanumeric",
    })}`;
    if (postData.accType === undefined) {
      //If accType is undefined, will make it 'Admin'.
      postData.accType = "Admin";
      postData.isAdmin = 1;
    }
    const userData = await User.create(postData); //Creating record. If any error comes here, it goes to line 36    ?????????????????????????????
    console.log("DB operation: ", userData.toJSON()); //Printing record to console.
    res.send({
      status: 200,
      data: userData,
      message: "User created successfully",
    }); //Sending response.
  } catch (e) {
    //res.send({status: 500, data: e, message: 'API Error Message'}); // sending a response
    console.log(e.name);
    if (e.name === "SequelizeUniqueConstraintError") {
      res.status(500).send({
        status: 500,
        data: e.name,
        message: "User with same Mobile or EmailID already exists",
      });
    } else if (e.name === "SequelizeValidationError") {
      //checks from Users.model.js if any validation error is there ex. if entered email's format is correct or not.
      res.status(500).send({
        status: 500,
        data: e.name,
        message: `Invalid ${e.errors[0].path}`,
      });
    } else {
      res
        .status(500)
        .send({ status: 500, data: e, message: "API Error Message" });
    }
  }
};

const userLogin = async (req, res) => {
  // async makes a function return a Promise.
  try {
    // console.log(config.jwtSecret);            // printing jwtSecret from config.json to console.
    // if(req.body.email !== demoUser.email) {   // checks if entered email and email in demoUser and their type aren't same.
    //   res.status(401).send({message: 'User not found'});  //send a response.
    // } else if(req.body.password !== demoUser.password) {  //checks if entered password and password in demoUser and their type aren't same.
    //   res.status(401).send({message: 'Invalid password'});//send a response.
    // } else {
    //   const token = jwt.sign({ userId: demoUser._id }, config.jwtSecret, { expiresIn: '24h' }); //Signs the given payload into a JSON webtoken. OR converts payload into encrypted form. jwt.sign(payload, secretOrPrivateKey, [options, callback]). payload could be an object literal, buffer or string representing valid JSON.
    //   res.status(200).send({token, message: 'Login Successfull'});  //send a response.
    // }

    // console.log(req.body.email);
    let userData = await User.findOne({
      //findOne finds from database whether email inside database matches entered email(line 62 & 63). And also, await expression causes async function execution to pause until a Promise is settled (that is, fulfilled or rejected), and to resume execution of the async function after fulfillment. When resumed, the value of the await expression is that of the fulfilled Promise
      plain: true, //ignores any extra information returned by Sequelize ORM
      where: {
        email: req.body.email, //email inside database matches entered email.
      },
      attributes: [
        "id",
        "name",
        "accType",
        "userID",
        ["password", "hashedPass"],
      ], //we have metioned here attributes because we want only these specific attribute's values from database. ????????????????
    });
    if (!userData) {
      //if email didn't matched thus no data goes in userData i.e empty/false
      res.status(401).send({ message: "User not found. Please try again" });
    } else {
      userData = userData.toJSON(); //.toJSON returns only the data i.e attributes line 65
      console.log(userData);
      // console.log(req.body.password, userData.hashedPass)
      const match = await bcrypt.compare(
        req.body.password,
        userData.hashedPass
      ); //here req.body.password that is coming from form is first encrypted and then it is compared with the hash/salt password stored in database(userData variable).
      // console.log(match);
      if (!match) {
        res.status(401).send({ message: "Invalid Password. Please try again" }); //if dosen't match sends response.
      } else {
        //console.log("awdawdawdawd" + req.session);
        const token = jwt.sign(
          {
            userId: userData.userID,
            isActive: true,
            userType: userData.accType,
          },
          config.jwtSecret,
          { expiresIn: "24h" }
        ); //if matches then creates a jwt token.
        let sessionData = req.session; // from where does req.session takes data ????????????????????
        sessionData.user = {};
        sessionData.token = token;
        sessionData.user.name = userData.name;
        sessionData.user.email = userData.email;
        sessionData.user.userType = userData.accType;
        res.status(200).send({
          token: token,
          userType: userData.accType,
          message: "Login Successfull",
        }); //response is sent
      }
    }
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ error: e, message: "Login failed. Please try again" }); //send a response.
  }
};

const userLogout = async (req, res) => {
  try {
    let sessionData = req.session;
    const logout = await sessionData.destroy();
    // console.log(logout);
    res.redirect("/");
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ error: e, message: "Logout Failed. Please try again" });
  }
};

module.exports = {
  userRegistration,
  userLogin,
  userLogout,
};
