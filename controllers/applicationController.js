const cases = require("change-case");
const moment = require("moment");
const db = require("../db/models");
const Applicants = db.Applicants;
const Timeline = db.Timeline;
const { Sequelize } = require("sequelize");

const path = "Applications";

const applicants = async (req, res) => {
  req.session.path = path;
  req.session.subpath = cases.sentenceCase("applicants");
  const sessionData = req.session;
  try {
    res.render("applications/applicants", {
      title: "Application - Applicants",
      sessionData: sessionData,
    });
  } catch (e) {
    res.render("applications/applicants", {
      title: "Application - Applicants",
      sessionData: sessionData,
    });
  }
};

const applicantProfile = async (req, res) => {
  req.session.path = path;
  req.session.subpath = cases.sentenceCase("applicants");
  const sessionData = req.session;
  const applicationId = req.params.profileid || "";
  try {
    res.render("applications/applicantProfile", {
      title: "Application - Applicant Profile",
      applicationId,
      moment,
      sessionData,
    });
  } catch (e) {
    res.render("applications/applicantProfile", {
      title: "Application - Applicant Profile",
      sessionData,
    });
  }
};

const getApplicantProfile = async (req, res) => {
  try {
    const applicationId = req.params.applicationid;
    let applicantData = await Applicants.findOne({
      plain: true, //ignores any extra information returned by Sequelize ORM
      where: {
        applicantID: applicationId,
      },
    });
    applicantData = applicantData.toJSON();
    applicantData.category =
      applicantData.isFresher === false ? "Experienced" : "Fresher";
    applicantData.experience = Math.floor(applicantData.experience / 12) || 0;
    applicantData.appliedOn = moment(applicantData.createdAt).format(
      "DD/MM/YYYY hh:mm:ss A"
    );
    res
      .status(200)
      .send({
        status: 200,
        data: applicantData,
        message: "Applicant Data Fetched",
      });
  } catch (e) {
    res.status(500).send({ status: 500, data: e, message: "API Error" });
  }
};

const getTimeline = async (req, res) => {
  try {
    const applicationId = req.params.applicationid;
    let applicantData = await Timeline.findAll({
      //plain: true, //ignores any extra information returned by Sequelize ORM
      where: {
        applicantID: applicationId,
      },
    });
    if (applicantData) {
      res
        .status(200)
        .send({
          status: 200,
          data: applicantData,
          message: "Applicant Timeline Fetched",
        });
    } else {
      res
        .status(200)
        .send({
          status: 200,
          data: "No Informations Available",
          message: "No Applicant Timeline Found",
        });
    }
  } catch (e) {
    res.status(500).send({ status: 500, data: e, message: "API Error" });
  }
};

const addTimeline = async (req, res) => {
  try {
    let postData = req.body;
    postData.applicantID = req.params.applicationid;
    const roundCounter = await Timeline.count({
      where: {
        applicantID: req.params.applicationid,
      },
    });
    if (parseInt(roundCounter, 10) === 0) {
      await Applicants.update(
        {
          statusCode: 1,
          status: "Processing",
        },
        {
          where: {
            applicantID: req.params.applicationid,
          },
        }
      );
    }
    postData.round = `Round ${parseInt(roundCounter, 10) + 1}`;
    const timelineData = await Timeline.create(postData);
    res
      .status(200)
      .send({
        status: 200,
        data: timelineData,
        message: "Timeline created successfully",
      });
  } catch (e) {
    res.status(500).send({ status: 500, data: e, message: "API Error" });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    let postData = req.body;
    postData.applicantID = req.params.applicationid;
    await Applicants.update(
      {
        statusCode: postData.statusCode,
        status: postData.status,
        comment: postData.reason,
      },
      {
        where: {
          applicantID: req.params.applicationid,
        },
      }
    );
    res
      .status(200)
      .send({
        status: 200,
        message: `Application ${postData.status} successfully`,
      });
  } catch (e) {
    res.status(500).send({ status: 500, data: e, message: "API Error" });
  }
};

const addApplicant = async (req, res) => {
  try {
    let postData = req.body;
    const data = await Applicants.create(postData);
    res
      .status(200)
      .send({ status: 200, message: `Application submitted successfully` });
  } catch (e) {
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

const getApplicants = async (req, res) => {
  //async makes a function return a Promise.
  try {
    //A JavaScript Promise object can be:
    //Pending
    // Fulfilled
    // Rejected
    // The Promise object supports two properties: state and result.
    // While a Promise object is "pending" (working), the result is undefined.
    // When a Promise object is "fulfilled", the result is a value.
    // When a Promise object is "rejected", the result is an error object.
    const data = await Applicants.findAll({
      //await makes a function wait for a Promise.
      order: [["createdAt", "DESC"]], //specifies the order according to createdAt Here it is descending order.
      attributes: [
        "applicantID",
        ["name", "candidate"],
        [
          Sequelize.literal(
            `CASE WHEN isFresher = true THEN 'Fresher' ELSE 'Experienced' END`
          ),
          "type",
        ], //Here, Sequelize.literal is SELECT *
        "statusCode",
        "status",
        "appliedFor",
        ["createdAt", "appliedOn"],
      ],
    });
    res
      .status(200)
      .send({
        status: 200,
        data,
        message: `Applications fetched successfully`,
      });
  } catch (e) {
    res
      .status(500)
      .send({ status: 500, data: e, message: "API Error Message" });
  }
};

module.exports = {
  addApplicant,
  applicants,
  applicantProfile,
  getApplicants,
  getApplicantProfile,
  getTimeline,
  addTimeline,
  updateApplicationStatus,
};
