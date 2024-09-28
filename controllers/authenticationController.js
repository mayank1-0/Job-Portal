const jwt = require("jsonwebtoken"); //imported and stored jwt module.
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const moment = require("moment");
const randtoken = require("rand-token");
const nodemailer = require("nodemailer");
const config = require("../config.json"); // imported and stored config.json file.
const db = require("../db/models");
const User = db.Users; //???????????????????????????????????????????????
const Op = db.Sequelize.Op; //??????????????????????????????????????????
require("dotenv").config();

// const demoUser = {                          //created an object demoUser containing
//   _id: 22031995,                            // id,
//   email: 'rajesh@studiographene.com',       // email,
//   password: '1234567'                       // password.
// };

const sendPasswordResetLink = async (req, res) => {
  try {
    // Generating resetToken and saving it in Users table under resetPasswordToken
    let email = req.body.email; // email where the reset password link is to be sent
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "",
        pass: "",
      },
    });

    let resetToken = await randtoken.generate(16);
    const setResetPasswordToken = await User.update(
      { resetPasswordToken: resetToken },
      {
        where: {
          email
        },
        individualHooks: true,
      }
    );

    // Sending the resetToken to the user's email whose password needs to be reset
    const info = await transporter.sendMail({
      from: "mayank.mehmi@gmail.com",
      to: email,
      subject: "Password reset link",
      html: `<b>Enter a new password</b><br>
      <form method="post" action="http://${process.env.HOST}:${process.env.PORT}/reset-password/${email}/${resetToken}?_method=PUT">
      <label for="password">Enter new password</label><br>
      <input name="password" type="password" required>
      <input type="submit" value="Submit">
      </form>`,
    });
    res.status(200).send({ status: 200, message: "Password reset link sent", data: resetToken });
  } catch (error) {
    res.status(500).send({ status: 500, message: "Something went wrong", error });
  }
}

const resetPassword = async (req, res) => {
  try {
    let newPassword = req.body.password;
    let email = req.params.email;
    let emailResetPasswordToken = req.params.token;
    let Users = db.Users;
    let userData = await Users.findOne({
      plain: true,
      where: { email },
      attributes: [["resetPasswordToken", "hashedToken"]]
    });
    if (!userData) {
      res.status(401).send({ message: "User not found. Please try again" });
    }
    userData = userData.toJSON();
    let dbResetPasswordToken = userData.hashedToken;

    const match = await bcrypt.compare(
      emailResetPasswordToken,
      dbResetPasswordToken
    );
    if (!match) {
      res.status(400).send({ message: "Invalid or expired link" });
    }
    else {
      await Users.update({
        password: newPassword,
        resetPasswordToken: null
      },
        {
          where: {
            email
          },
          individualHooks: true
        }
      );
    }
    res.status(200).redirect('/');
  } catch (error) {
    res.status(500).send({ status: 500, success: false, message: "Something went wrong" });
  }
}

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
    res.send({
      status: 200,
      data: userData,
      message: "User created successfully",
    }); //Sending response.
  } catch (e) {
    //res.send({status: 500, data: e, message: 'API Error Message'}); // sending a response
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
                // printing jwtSecret from config.json to console.
    // if(req.body.email !== demoUser.email) {   // checks if entered email and email in demoUser and their type aren't same.
    //   res.status(401).send({message: 'User not found'});  //send a response.
    // } else if(req.body.password !== demoUser.password) {  //checks if entered password and password in demoUser and their type aren't same.
    //   res.status(401).send({message: 'Invalid password'});//send a response.
    // } else {
    //   const token = jwt.sign({ userId: demoUser._id }, config.jwtSecret, { expiresIn: '24h' }); //Signs the given payload into a JSON webtoken. OR converts payload into encrypted form. jwt.sign(payload, secretOrPrivateKey, [options, callback]). payload could be an object literal, buffer or string representing valid JSON.
    //   res.status(200).send({token, message: 'Login Successfull'});  //send a response.
    // }

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
      userData = userData.toJSON(); //here .toJSON() converts userData object to JSON format.
      const match = await bcrypt.compare(
        req.body.password,
        userData.hashedPass
      ); //here req.body.password that is coming from the form is first encrypted and then it is compared with the hash/salt password stored in database(userData variable).
      if (!match) {
        res.status(401).send({ message: "Invalid Password. Please try again" }); //if dosen't match sends response.
      } else {
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
    res
      .status(500)
      .send({ error: e, message: "Login failed. Please try again" }); //send a response.
  }
};

const userLogout = async (req, res) => {
  try {
    let sessionData = req.session;
    const logout = await sessionData.destroy();
    res.redirect("/");
  } catch (e) {
    res
      .status(500)
      .send({ error: e, message: "Logout Failed. Please try again" });
  }
};

module.exports = {
  sendPasswordResetLink,
  resetPassword,
  userRegistration,
  userLogin,
  userLogout,
};
