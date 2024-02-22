const db = require("../db/models");
const Openings = db.Openings; //???????????????????????????????????????????????????????? what does this line do ?
const Applicants = db.Applicants; //???????????????????????????????????????????????????????? what does this line do ?
const { Sequelize } = require("sequelize");
const cases = require("change-case");

const path = "Openings";

const addOpening = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    await Openings.create(data);
    res
      .status(200)
      .send({ status: 200, message: "Job opening posted successfully" });
  } catch (e) {
    console.log(e);
    if (e.name === "SequelizeUniqueConstraintError") {
      res
        .status(500)
        .send({
          status: 500,
          data: e.name,
          message: "User with same Mobile or EmailID already exists",
        });
    } else if (e.name === "SequelizeValidationError") {
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

const getJobOpenings = async (req, res) => {
  try {
    const data = await Openings.findAll({
      order: [["updatedAt", "DESC"]],
      attributes: [
        "id",
        "openingName",
        "location",
        "department",
        "updatedAt",
        [
          Sequelize.literal(
            `CASE WHEN isActive = true THEN 'ACTIVE' ELSE 'INACTIVE' END`
          ),
          "status",
        ],
      ],
    });
    res
      .status(200)
      .send({
        status: 200,
        data,
        message: "Job openings fetched successfully",
      });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ status: 500, message: "API Error. Please try again" });
  }
};

const getOpeningProfile = async (req, res) => {
  try {
    const profileId = req.params.profileid;
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

const getOpeningProfileTimeline = async (req, res) => {
  try {
    //var text='';
    const profileId = req.params.profileid;
    // if(profileId == 1)
    // {
    //    text='NodeJS Developer';
    //  }
    let openingData = await Applicants.findAll({
      //plain: true, //ignores any extra information returned by Sequelize ORM
      order: [["createdAt", "DESC"]],
      where: {
        AppliedForCode: profileId,
      },
    });
    //openingData = openingData.toJSON();
    // openingData.category = (openingData.isFresher === false ? 'Experienced' : 'Fresher');
    // openingData.experience = Math.floor(openingData.experience/12) || 0;
    // openingData.appliedOn = moment(openingData.createdAt).format('DD/MM/YYYY hh:mm:ss A');
    console.log("zxzxzx" + openingData);
    //console.log(applicantData.isFresher === false ? 'Experienced' : 'Fresher');
    res
      .status(200)
      .send({
        status: 200,
        data: openingData,
        message: "Opening Data Fetched",
      }); //<-----------------------------------
  } catch (e) {
    console.log("laksdl" + e);
    res.status(500).send({ status: 500, data: e, message: "API Error" });
  }
};

const jobs = async (req, res) => {
  req.session.path = path;
  req.session.subpath = cases.sentenceCase("jobs");
  const sessionData = req.session;
  try {
    res.render("openings/jobs", {
      title: "Openings - Jobs",
      sessionData,
    });
  } catch (e) {
    res.render("openings/jobs", {
      title: "Openings - Jobs",
      sessionData,
    });
  }
};

const jobdetails = async (req, res) => {
  req.session.path = path;
  req.session.subpath = cases.sentenceCase("jobs");
  const sessionData = req.session;
  const profileId = req.params.profileid || "";
  try {
    res.render("openings/jobdetails", {
      title: "Openings - Job Details",
      sessionData,
      profileId,
    });
  } catch (e) {
    res.render("openings/jobdetails", {
      title: "Openings - Job Details",
      sessionData,
    });
  }
};

const updateJobOpeningStatus = async (req, res) => {
  try {
    let postData = req.body;
    console.log(postData);
    await Openings.update(
      {
        isActive: postData.status,
      },
      {
        where: {
          id: req.params.openingid,
        },
      }
    );
    res
      .status(200)
      .send({
        status: 200,
        message: `Job Opening status updated successfully`,
      });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ status: 500, message: "API Error. Please try again" });
  }
};

module.exports = {
  addOpening,
  getJobOpenings,
  jobs,
  updateJobOpeningStatus,
  jobdetails,
  getOpeningProfile,
  getOpeningProfileTimeline,
};
