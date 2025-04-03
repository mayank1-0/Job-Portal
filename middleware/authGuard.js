module.exports = (req, res, next) => {
	try {
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
