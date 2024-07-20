module.exports = (req, res, next) => {          //--------------------DONE!
  try {
    console.log("Session Data: ", req.session);
    if (req.session.user) {
      //if true, means user is already logged in and is on dashboard page.If false, means he has just opened the login screen.
      res.redirect("/users/dashboard");
    } else {
      // throw 'Session Expired';
      next(); //If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.
    }
  } catch {
    res.redirect("/");
  }
};
