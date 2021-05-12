const getDashboard = async(req, res) => {
    try {
      const userType = req.param('userType');
      console.log(userType);
      if(userType === 'admin') {
        res.render('dashboard/adminDashboard', {title: 'Dashboard - Admin', path: 'Dashboard', subpath: 'Admin'});  //will render views/dashboard/adminDashboard.js and pass dynamic values i.e values in second argument
      } else {
        res.render('dashboard/adminDashboard', {title: 'Dashboard - Admin', layout: 'layout.ejs'}); //will render adminDashboard.ejs for which the layout file will be layout.ejs(It contains html tags)
      }
    } catch(e) {
      res.render('/', {title: 'Login'});
    }
  };
  
  module.exports = {
    getDashboard,
  };