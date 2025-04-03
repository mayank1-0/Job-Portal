const db = require("../db/models");
const Openings = db.Openings;
const Applicants = db.Applicants;

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
		res
			.status(200)
			.send({
				status: 200,
				data: openingData,
				message: "Opening Data Fetched",
			});
	} catch (e) {
		res.status(500).send({ status: 500, data: e, message: "API Error" });
	}
};

const jobsapply = async (req, res) => {
	try {
		res.render("candidates", {});
	} catch (e) {
		res.render("publicURL", {});
	}
};

const jobsapplytest = async (req, res) => {
	try {
		res.render("candidatestest", {});
	} catch (e) {
		res.render("publicURL", {});
	}
};

const applicantRegistration = async (req, res) => {
	// async makes a function return a Promise OR The word “async” before a function means one simple thing: a function always returns a promise.
	try {
		let postData = req.body; //This line means, whatever data is being sent in the post request(through body of candidates.ejs) is stored in postData.
		//res.send({status: 200, data: postData, message: 'API Success Message'}); // sending a response

		const applicantData = await Applicants.create(postData); //Creating record. If any error comes here, it goes to line 36    ?????
		res.send({ status: 200, message: "Applicant registered successfully" }); //Sending response.
	} catch (e) {
		//res.send({status: 500, data: e, message: 'API Error Message'}); // sending a response
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

module.exports = {
	publicURLopeningDetails,
	publicURLgetOpeningProfile,
	jobsapply,
	jobsapplytest,
	applicantRegistration
};
