var express = require('express');
var router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');
const authGurad = require('../middleware/authGuard');

/* GET users listing. */
router.get('/applicants', authGurad, applicationController.applicants);
router.get('/applicants/profile/:profileid', authGurad, applicationController.applicantProfile);

/* APIs */
router.get('/api/v1/applicant/:applicationid', auth, applicationController.getApplicantProfile);
router.get('/api/v1/timeline/:applicationid', auth, applicationController.getTimeline);
router.post('/api/v1/add-timeline/:applicationid', auth, applicationController.addTimeline);
router.put('/api/v1/confirm-reject-candidate/:applicationid', auth, applicationController.updateApplicationStatus);
router.post('/api/v1/add-applicant', applicationController.addApplicant);
router.get('/api/v1/get-applicants', auth, applicationController.getApplicants);

module.exports = router;
