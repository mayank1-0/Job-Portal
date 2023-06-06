module.exports = (req, res, next) => {
  try {
    console.log("Session Data: ", req.session);
    if (req.session.user) {
      next();
    } else {
      // throw 'Session Expired';
      res.redirect("/");
    }
  } catch {
    res.redirect("/");
  }
};
