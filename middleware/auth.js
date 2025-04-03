const jwt = require("jsonwebtoken");
const config = require("../config.json");

module.exports = (req, res, next) => {      // ------ DONE!
	try {
		const token = req.headers.authorization.split(" ")[1]; //splits Type and Token by ' ' and [1] here represents index 1.
		if (req.session.user && req.session.token && req.session.token === token) {
			const decodedToken = jwt.verify(token, config.jwtSecret); //encodes token again(which gives the decoded version) with jwtSecret. Also, checks if token is expired or not.
			const tokenStatus = decodedToken.isActive;
			if (tokenStatus) {
				next();
			} else {
				throw "Invalid token";  
			} 
		} else if (!req.session.token) {
			const decodedToken = jwt.verify(token, config.jwtSecret);
			const tokenStatus = decodedToken.isActive;
			if (tokenStatus) {
				next();
			} else {
				throw "Invalid token";
			}
		} else {
			throw "Invalid token";
		}
	} catch {
		res.status(401).send({
			error: "Authorization Failed. Invalid Token",
		});
	}
};
