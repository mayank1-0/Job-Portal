var express = require("express");
var router = express.Router();
const publicURLController = require("../controllers/publicURLController");
const auth = require("../middleware/auth");
const authGurad = require("../middleware/authGuard");

/* GET users listing. */
router.get("/jobs/:openingid", publicURLController.publicURLopeningDetails);
router.get("/jobsapply", publicURLController.jobsapply);
router.get("/jobsapplytest", publicURLController.jobsapplytest);
//. router.get('/jobs', authGurad, openingsController.jobs);
//. router.get('/jobdetails', openingsController.jobdetails);
//. router.get('/profile/:profileid', authGurad, openingsController.jobdetails);
// router.get('/applicants/profile/:profileid', authGurad, applicationController.applicantProfile);

/* APIs */
router.get(
  "/api/v1/fetch/:openingid",
  publicURLController.publicURLgetOpeningProfile
);
router.post(
  "/applicant-registration",
  publicURLController.applicantRegistration
);

module.exports = router;
