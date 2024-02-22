const db = require("../db/models");
const Openings = db.Openings; //???????????????????????????????????????????????????????? what does this line do ?
const Applicants = db.Applicants; //???????????????????????????????????????????????????????? what does this line do ?
//const sequelize = require("sequelize");
//const { Sequelize } = require("sequelize");
//const cases = require("change-case");

// const applicantProfile = async(req, res) => {
//     req.session.path = path;
//     req.session.subpath = cases.sentenceCase('applicants');
//     const sessionData = req.session;
//     const applicationId = req.params.profileid || '';
//     try {
//       res.render('applications/applicantProfile', {
//         title: 'Application - Applicant Profile',
//         applicationId,
//         moment,
//         sessionData
//       });
//     } catch(e) {
//       res.render('applications/applicantProfile', {
//         title: 'Application - Applicant Profile',
//         sessionData
//       });
//     }
//   };

const publicURLopeningDetails = async (req, res) => {
  const profileId = req.params.openingid;
  try {
    res.render("publicURL", {
      title: "Openings - Jobs",
      profileId,
    });
  } catch (e) {
    res.render("publicURL", {
      title: "Openings - Jobs",
      profileId,
    });
  }
};

const publicURLgetOpeningProfile = async (req, res) => {
  try {
    const profileId = req.params.openingid;
    let openingData = await Openings.findOne({
      plain: true, //ignores any extra information returned by Sequelize ORM
      where: {
        id: profileId,
      },
    });
    openingData = openingData.toJSON();
    // openingData.category = (applicantData.isFresher === false ? 'Experienced' : 'Fresher');
    // openingData.experience = Math.floor(applicantData.experience/12) || 0;
    // openingData.appliedOn = moment(applicantData.createdAt).format('DD/MM/YYYY hh:mm:ss A');
    console.log(openingData);
    // console.log(applicantData.isFresher === false ? 'Experienced' : 'Fresher');
    res
      .status(200)
      .send({
        status: 200,
        data: openingData,
        message: "Opening Data Fetched",
      });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: 500, data: e, message: "API Error" });
  }
};

const jobsapply = async (req, res) => {
  //var applicationId = req.params.number;
  //const profileId = req.params.openingid;
  try {
    res.render("candidates", {
      //title: 'Apply - Jobs',
      //applicationId
    });
  } catch (e) {
    res.render("publicURL", {
      //title: 'Openings - Jobs',
      //applicationId
    });
  }
};

const jobsapplytest = async (req, res) => {
  //var applicationId = req.params.number;
  //const profileId = req.params.openingid;
  try {
    res.render("candidatestest", {
      //title: 'Apply - Jobs',
      //applicationId
    });
  } catch (e) {
    res.render("publicURL", {
      //title: 'Openings - Jobs',
      //applicationId
    });
  }
};

const applicantRegistration = async (req, res) => {
  // async makes a function return a Promise OR The word “async” before a function means one simple thing: a function always returns a promise.
  try {
    let postData = req.body; //This line means, whatever data is being sent in the post request(through body of candidates.ejs) is stored in postData.
    //res.send({status: 200, data: postData, message: 'API Success Message'}); // sending a response

    const applicantData = await Applicants.create(postData); //Creating record. If any error comes here, it goes to line 36    ?????????????????????????????
    console.log("DB operation: ", applicantData.toJSON()); //Printing record to console.
    res.send({ status: 200, message: "Applicant registered successfully" }); //Sending response.
  } catch (e) {
    //res.send({status: 500, data: e, message: 'API Error Message'}); // sending a response
    console.log(e.name);
    if (e.name === "SequelizeUniqueConstraintError") {
      res
        .status(500)
        .send({
          status: 500,
          data: e.name,
          message: "User with same Mobile or EmailID already exists",
        });
    } else if (e.name === "SequelizeValidationError") {
      //checks from Users.model.js if any validation error is there ex. if entered email's format is correct or not.
      res
        .status(500)
        .send({
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

// const addOpening = async(req, res) => {
//   try {
//     const data = req.body;
//     console.log(data);
//     await Openings.create(data);
//     res.status(200).send({status: 200, message: 'Job opening posted successfully'});
//   } catch(e) {
//     console.log(e);
//     if (e.name === 'SequelizeUniqueConstraintError') {
//       res.status(500).send({ status: 500, data: e.name, message: 'User with same Mobile or EmailID already exists' });
//     } else if (e.name === 'SequelizeValidationError') {
//       res.status(500).send({ status: 500, data: e.name, message: `Invalid ${e.errors[0].path}` });
//     } else {
//       res.status(500).send({ status: 500, data: e, message: 'API Error Message' });
//     }
//   }
// };

// const getJobOpenings = async(req, res) => {
//   try {
//     const data = await Openings.findAll({
//       order: [['updatedAt', 'DESC']],
//       attributes: ['id', 'openingName', 'location', 'department', 'updatedAt',
//       [Sequelize.literal(`CASE WHEN isActive = true THEN 'ACTIVE' ELSE 'INACTIVE' END`), 'status'],
//     ]
//     });
//     res.status(200).send({status: 200, data, message: 'Job openings fetched successfully'});
//   } catch(e) {
//     console.log(e);
//     res.status(500).send({status: 500, message: 'API Error. Please try again'});
//   }
// };

// const getOpeningProfile = async(req, res) => {
//   try {
//     const profileId = req.params.profileid;
//     let openingData = await Openings.findOne({
//       plain: true, //ignores any extra information returned by Sequelize ORM
//       where: {
//         id: profileId,
//       }
//     });
//     openingData = openingData.toJSON();
//     // openingData.category = (applicantData.isFresher === false ? 'Experienced' : 'Fresher');
//     // openingData.experience = Math.floor(applicantData.experience/12) || 0;
//     // openingData.appliedOn = moment(applicantData.createdAt).format('DD/MM/YYYY hh:mm:ss A');
//     console.log(openingData);
//     // console.log(applicantData.isFresher === false ? 'Experienced' : 'Fresher');
//     res.status(200).send({status: 200, data: openingData, message: 'Opening Data Fetched'});
//   } catch(e) {
//     console.log(e);
//     res.status(500).send({status: 500, data: e, message: 'API Error'});
//   }
// };

// const getOpeningProfileTimeline = async(req, res) => {
//     try {
//       //var text='';
//       const profileId = req.params.profileid;
//       // if(profileId == 1)
//       // {
//       //    text='NodeJS Developer';
//       //  }
//       let openingData = await Applicants.findAll({
//         //plain: true, //ignores any extra information returned by Sequelize ORM
//         where: {
//           AppliedForCode: profileId,
//         }
//       });
//       //openingData = openingData.toJSON();
//       // openingData.category = (openingData.isFresher === false ? 'Experienced' : 'Fresher');
//       // openingData.experience = Math.floor(openingData.experience/12) || 0;
//       // openingData.appliedOn = moment(openingData.createdAt).format('DD/MM/YYYY hh:mm:ss A');
//       console.log("zxzxzx" + openingData);
//       //console.log(applicantData.isFresher === false ? 'Experienced' : 'Fresher');
//       res.status(200).send({status: 200, data: openingData, message: 'Opening Data Fetched'});  //<-----------------------------------
//     } catch(e) {
//       console.log("laksdl"+e);
//       res.status(500).send({status: 500, data: e, message: 'API Error'});
//     }
//   };

// const jobs = async(req, res) => {
//   req.session.path = path;
//   req.session.subpath = cases.sentenceCase('jobs');
//   const sessionData = req.session;
//   try {
//     res.render('openings/jobs', {
//       title: 'Openings - Jobs',
//       sessionData
//     });
//   } catch(e) {
//     res.render('openings/jobs', {
//       title: 'Openings - Jobs',
//       sessionData
//     });
//   }
// };

// const jobdetails = async(req, res) => {
//   req.session.path = path;
//   req.session.subpath = cases.sentenceCase('jobs');
//   const sessionData = req.session;
//   const profileId = req.params.profileid || '';
//   try {
//     res.render('openings/jobdetails', {
//       title: 'Openings - Job Details',
//       sessionData,
//       profileId
//     });
//   } catch(e) {
//     res.render('openings/jobdetails', {
//       title: 'Openings - Job Details',
//       sessionData
//     });
//   }
// };

// const updateJobOpeningStatus = async(req, res) => {
//   try {
//     let postData = req.body;
//     console.log(postData);
//     await Openings.update({
//       isActive: postData.status,
//     }, {
//       where: {
//         id: req.params.openingid,
//       }
//     });
//     res.status(200).send({status: 200, message: `Job Opening status updated successfully`});
//   } catch(e) {
//     console.log(e);
//     res.status(500).send({status: 500, message: 'API Error. Please try again'});
//   }
// };

module.exports = {
  publicURLopeningDetails,
  publicURLgetOpeningProfile,
  jobsapply,
  jobsapplytest,
  applicantRegistration,
  //   addOpening,
  //   getJobOpenings,
  //   jobs,
  //   updateJobOpeningStatus,
  //   jobdetails,
  //   getOpeningProfile,
  //   getOpeningProfileTimeline
};
