const cases = require("change-case");
const getDashboard = async (req, res) => {
  try {
    //const userType = req.param('userType'); //userType variable will take userType from param 'userType' inside url in index.ejs line 220.
    req.session.path = "Dashboard";
    req.session.subpath = cases.sentenceCase(req.session.user.userType); //Here, cases.sentenceCase() capitalize the first character that comes through the argument.
    const sessionData = req.session; //userData through session.
    const userType = cases.noCase(req.session.user.userType); //noCase() is used if userType comes as'Admin', noCase() will convert it to 'admin'.
    if (userType === "admin") {
      //
      res.render("dashboard/adminDashboard", {
        title: "Dashboard - Admin",
        path: "Dashboard",
        subpath: "Admin",
        sessionData: sessionData,
      }); //will render views/dashboard/adminDashboard.ejs and pass dynamic values i.e values in second argument
    } else {
      res.render("dashboard/adminDashboard", {
        title: "Dashboard - Admin",
        layout: "layout.ejs",
        sessionData: sessionData,
      }); //will render adminDashboard.ejs for which the layout file will be layout.ejs(It contains html tags)
    }
  } catch (e) {
    res.render("/", { title: "Login" });
  }
};

module.exports = {
  getDashboard,
};
